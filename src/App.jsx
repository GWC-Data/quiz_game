import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ROUNDS, QUIZ_TITLE, QUIZ_SUBTITLE } from './quizConfig';
import { gradeAnswer } from './gradeAnswer';
import { primeAudio, playCorrectSound, playWrongSound } from './sounds';

const STATUS_COLORS = {
  idle: 'text-[#64748B]',
  listening: 'text-[#6D3CCB]',
  thinking: 'text-[#4F8EF7]',
  success: 'text-emerald-600',
  error: 'text-red-500',
};

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19 11a7 7 0 01-14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M7 5.5v13l12-6.5-12-6.5z" fill="currentColor" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M7 4h10v3a5 5 0 01-10 0V4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 5H4v1a3.5 3.5 0 003.5 3.5M17 5h3v1A3.5 3.5 0 0116.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 12v3M9 19h6M10 15.5h4v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const WAVEFORM_BAR_COUNT = 32;
const WAVEFORM_BAR_COLORS = ['#4F8EF7', '#6D3CCB', '#A78BFA'];

function Waveform({ levels, reduceMotion }) {
  return (
    <div className="flex h-8 w-full max-w-[280px] items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: WAVEFORM_BAR_COUNT }, (_, i) => {
        const level = levels?.[i] ?? 6;
        return (
          <span
            key={i}
            className="min-w-[2px] flex-1 rounded-full"
            style={{
              height: `${Math.max(8, Math.min(100, level))}%`,
              backgroundColor: WAVEFORM_BAR_COLORS[i % WAVEFORM_BAR_COLORS.length],
              transition: reduceMotion ? 'none' : 'height 90ms ease-out',
            }}
          />
        );
      })}
    </div>
  );
}

const CONFETTI_COLORS = ['#6D3CCB', '#A78BFA', '#4F8EF7', '#FFFFFF'];

function ConfettiBurst({ trigger, reduceMotion }) {
  const [pieces, setPieces] = useState([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    if (!trigger || reduceMotion) return undefined;

    const next = Array.from({ length: 14 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.6;
      const distance = 28 + Math.random() * 24;
      return {
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 8,
        rot: Math.random() * 360,
        delay: Math.random() * 70,
      };
    });
    setPieces(next);
    const timeout = setTimeout(() => setPieces([]), 900);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, reduceMotion]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none absolute -left-1 top-1/2 z-20 -translate-y-1/2" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute h-1.5 w-2.5 animate-confetti-piece"
          style={{
            backgroundColor: piece.color,
            '--tx': `${piece.tx}px`,
            '--ty': `${piece.ty}px`,
            '--rot': `${piece.rot}deg`,
            animationDelay: `${piece.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

const CELEBRATION_SHAPES = ['rect', 'circle', 'streamer'];

function CelebrationConfetti({ trigger, reduceMotion }) {
  const [pieces, setPieces] = useState([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    if (!trigger || reduceMotion) return undefined;

    const next = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: CELEBRATION_SHAPES[i % CELEBRATION_SHAPES.length],
      duration: 1800 + Math.random() * 900,
      delay: Math.random() * 500,
      drift: (Math.random() - 0.5) * 90,
      rotateEnd: 360 + Math.random() * 360,
    }));
    setPieces(next);
    const timeout = setTimeout(() => setPieces([]), 2800);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, reduceMotion]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => {
        const shapeClass =
          piece.shape === 'circle'
            ? 'h-2 w-2 rounded-full'
            : piece.shape === 'streamer'
              ? 'h-4 w-1.5 rounded-full'
              : 'h-2.5 w-2 rounded-sm';
        return (
          <span
            key={piece.id}
            className={`absolute top-0 animate-confetti-fall ${shapeClass}`}
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDuration: `${piece.duration}ms`,
              animationDelay: `${piece.delay}ms`,
              '--drift': `${piece.drift}px`,
              '--rotate-end': `${piece.rotateEnd}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

function AnswerRow({ index, concept, isJustMatched, shouldFlash, flashToken, reduceMotion }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }
    if (!shouldFlash) return undefined;
    setIsFlashing(true);
    const timeout = setTimeout(() => setIsFlashing(false), reduceMotion ? 0 : 620);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashToken]);

  const isAnswered = Boolean(concept);

  const badgeClasses = [
    'absolute -left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold shadow-md ring-2 transition-all duration-300',
    isAnswered ? 'text-[#6D3CCB] ring-[#6D3CCB]' : 'text-[#64748B] ring-[#E2E4F0]',
    isJustMatched && !reduceMotion ? 'animate-pop' : '',
    isFlashing && !reduceMotion ? 'animate-flash-red' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const borderWrapperClasses = isAnswered
    ? 'bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] shadow-[0_6px_16px_-8px_rgba(109,60,203,0.45)]'
    : 'bg-[#E2E4F0] hover:bg-gradient-to-r hover:from-[#A78BFA] hover:to-[#4F8EF7]';

  return (
    <div className="relative">
      <ConfettiBurst trigger={isJustMatched} reduceMotion={reduceMotion} />
      <span className={badgeClasses}>{index + 1}</span>
      <div className={`rounded-2xl p-[1.5px] transition-all duration-300 ${borderWrapperClasses}`}>
        <div
          className={`rounded-2xl flex items-center gap-3 py-3.5 pl-9 pr-4 transition-all duration-300 ${
            isAnswered ? 'bg-[#F1EDFF]' : 'bg-white/70 hover:bg-[#F5F2FF]'
          }`}
        >
          {isAnswered ? (
            <span
              className={`flex flex-1 items-center justify-between text-sm font-semibold text-[#172554] ${
                isJustMatched && !reduceMotion ? 'animate-fade-slide-in' : ''
              }`}
            >
              {concept.label}
              <span className="text-[#6D3CCB]">
                <CheckIcon />
              </span>
            </span>
          ) : (
            <span className="text-sm italic text-[#64748B]/80">Ready to Guess…</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StartScreen({ onStart, reduceMotion }) {
  return (
    <div className={`relative w-full max-w-xl flex flex-col gap-6 ${!reduceMotion ? 'animate-rise-in' : ''}`}>
      <div className="flex items-center gap-1.5 pl-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#6D3CCB]" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D3CCB]">Voice Quiz</span>
      </div>

      <div className="rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_20px_50px_-20px_rgba(23,37,84,0.28)]">
        <div className="rounded-[20px] flex flex-col items-center gap-5 bg-[rgba(255,255,255,0.72)] backdrop-blur-md px-6 py-10 text-center sm:px-10">
          <div className={`relative flex h-20 w-20 shrink-0 items-center justify-center ${!reduceMotion ? 'animate-float' : ''}`}>
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6D3CCB]/40 via-[#A78BFA]/30 to-[#4F8EF7]/40 blur-md"
              aria-hidden="true"
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-[0_10px_24px_-8px_rgba(109,60,203,0.5)] ring-1 ring-[#E2E4F0]">
              <img src="/half_logo.png" alt="Quiz logo" className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#172554]">{QUIZ_TITLE}</h1>
            <p className="max-w-md text-sm leading-relaxed text-[#64748B]">{QUIZ_SUBTITLE}</p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            {ROUNDS.map((round, index) => (
              <span
                key={round.id}
                className="flex items-center gap-1.5 rounded-full border border-[#E2E4F0] bg-white/70 px-3 py-1 text-xs font-semibold text-[#172554]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F1EDFF] text-[10px] text-[#6D3CCB]">
                  {index + 1}
                </span>
                {round.title}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6D3CCB] to-[#4F8EF7] px-7 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(109,60,203,0.6)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
          >
            <PlayIcon />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VoiceQuiz() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [answeredList, setAnsweredList] = useState([]);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [micStatus, setMicStatus] = useState('Tap the microphone and speak your answer…');
  const [statusTone, setStatusTone] = useState('idle');
  const [lastTranscript, setLastTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [justMatchedRowIndex, setJustMatchedRowIndex] = useState(null);
  const [scoreBump, setScoreBump] = useState(false);
  const [flashRowIndex, setFlashRowIndex] = useState(null);
  const [flashToken, setFlashToken] = useState(0);
  const [interimText, setInterimText] = useState('');
  const [waveformLevels, setWaveformLevels] = useState(() => new Array(WAVEFORM_BAR_COUNT).fill(6));

  const recognitionRef = useRef(null);
  const handleTranscriptRef = useRef(() => {});
  const finalTranscriptRef = useRef('');
  const interimTextRef = useRef('');
  const hadErrorRef = useRef(false);
  const audioDetectedRef = useRef(false);
  const micStreamRef = useRef(null);
  const analyserCtxRef = useRef(null);
  const visualizerFrameRef = useRef(null);
  const isFirstRoundCheckRef = useRef(true);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const round = ROUNDS[currentRoundIndex];
  const concepts = round.concepts;
  const isLastRound = currentRoundIndex === ROUNDS.length - 1;

  const answeredIds = useMemo(() => new Set(answeredList.map((c) => c.id)), [answeredList]);
  const remainingConcepts = useMemo(
    () => concepts.filter((c) => !answeredIds.has(c.id)),
    [answeredIds, concepts]
  );
  const isRoundComplete = answeredList.length === concepts.length;

  const handleTranscript = useCallback(
    async (transcriptText) => {
      setLastTranscript(transcriptText);
      setStatusTone('thinking');
      setMicStatus('Thinking…');
      setIsGrading(true);

      try {
        const result = await gradeAnswer(transcriptText, remainingConcepts);
        const concept = result.matchedId != null
          ? concepts.find((c) => c.id === result.matchedId)
          : null;

        if (concept) {
          const rowIndex = answeredList.length;
          const nextList = [...answeredList, concept];
          setAnsweredList(nextList);
          setScore(nextList.length);
          setJustMatchedRowIndex(rowIndex);
          setScoreBump(true);
          setStatusTone('success');
          setMicStatus(`Matched to ${concept.label}`);
          playCorrectSound();
          setTimeout(() => setJustMatchedRowIndex(null), prefersReducedMotion ? 0 : 400);
          setTimeout(() => setScoreBump(false), prefersReducedMotion ? 0 : 320);
        } else {
          setStatusTone('error');
          setMicStatus('No match found, try again.');
          setFlashRowIndex(answeredList.length);
          setFlashToken((t) => t + 1);
          playWrongSound();
        }
      } catch (error) {
        console.error('Unexpected grading error:', error);
        setStatusTone('error');
        setMicStatus('Something went wrong grading that answer — try again.');
      } finally {
        setIsGrading(false);
      }
    },
    [answeredList, remainingConcepts, concepts, prefersReducedMotion]
  );

  useEffect(() => {
    handleTranscriptRef.current = handleTranscript;
  });

  const stopVisualizer = useCallback(() => {
    if (visualizerFrameRef.current) {
      cancelAnimationFrame(visualizerFrameRef.current);
      visualizerFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (analyserCtxRef.current) {
      analyserCtxRef.current.close().catch(() => {});
      analyserCtxRef.current = null;
    }
    setWaveformLevels(new Array(WAVEFORM_BAR_COUNT).fill(6));
  }, []);

  // Best-effort decorative fallback for when real mic-level analysis isn't
  // available (older browsers, permission quirks) so listening still feels alive.
  const runSyntheticVisualizer = useCallback(() => {
    let phase = 0;
    const tick = () => {
      phase += 1;
      const next = Array.from(
        { length: WAVEFORM_BAR_COUNT },
        (_, i) => 18 + Math.abs(Math.sin(phase / 6 + i / 2.2)) * 70 * (0.4 + Math.random() * 0.6)
      );
      setWaveformLevels(next);
      visualizerFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  // Analyzes the real microphone input in real time (Web Audio AnalyserNode)
  // so the waveform bars reflect actual speech, not a canned animation.
  const startVisualizer = useCallback(async () => {
    if (prefersReducedMotion) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioContextImpl = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextImpl();
      analyserCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const step = Math.max(1, Math.floor(bufferLength / WAVEFORM_BAR_COUNT));

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const next = Array.from({ length: WAVEFORM_BAR_COUNT }, (_, i) => {
          const value = dataArray[i * step] || 0;
          return Math.max(6, (value / 255) * 100);
        });
        setWaveformLevels(next);
        visualizerFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      console.error('Mic visualizer unavailable, using a decorative animation instead:', error);
      runSyntheticVisualizer();
    }
  }, [prefersReducedMotion, runSyntheticVisualizer]);

  useEffect(() => {
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      setSpeechSupported(false);
      setStatusTone('idle');
      setMicStatus('Voice recognition is not supported in this browser.');
      return undefined;
    }

    const recognition = new SpeechRecognitionImpl();
    // continuous + interim results so recognition keeps listening across pauses
    // instead of cutting off after the first short phrase, and the UI can show
    // a live caption while the user is still speaking.
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscriptRef.current += `${res[0].transcript} `;
        } else {
          interimChunk += res[0].transcript;
        }
      }
      interimTextRef.current = interimChunk;
      setInterimText(interimChunk);
    };

    recognition.onaudiostart = () => {
      audioDetectedRef.current = true;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      hadErrorRef.current = true;
      setStatusTone('error');
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicStatus('Microphone access was blocked — check your browser permissions.');
      } else if (event.error === 'audio-capture') {
        setMicStatus('No microphone was found — check your device settings.');
      } else if (event.error === 'network') {
        setMicStatus('Network error — speech recognition needs an internet connection.');
      } else if (event.error === 'no-speech') {
        setMicStatus("No speech detected — check your mic isn't muted and try again.");
      } else {
        setMicStatus(`Mic error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      stopVisualizer();
      const transcript = `${finalTranscriptRef.current} ${interimTextRef.current}`.trim();
      finalTranscriptRef.current = '';
      interimTextRef.current = '';
      setInterimText('');

      if (transcript) {
        handleTranscriptRef.current(transcript);
      } else if (!hadErrorRef.current) {
        setStatusTone('idle');
        setMicStatus(
          audioDetectedRef.current
            ? "Didn't catch that — tap the mic and try again."
            : "No audio reached the mic — check it isn't muted or blocked, then try again."
        );
      }
      hadErrorRef.current = false;
      audioDetectedRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onaudiostart = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      stopVisualizer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    if (!speechSupported || isGrading || isTransitioning || quizEnded || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    primeAudio();
    startVisualizer();
    setStatusTone('listening');
    setMicStatus('Listening…');
    setLastTranscript('');
    finalTranscriptRef.current = '';
    interimTextRef.current = '';
    setInterimText('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Could not start recognition:', error);
    }
  };

  // Advance to the next round a moment after the current one's last concept
  // is matched, so the user sees the final checkmark before it resets.
  useEffect(() => {
    if (isFirstRoundCheckRef.current) {
      isFirstRoundCheckRef.current = false;
      return undefined;
    }
    if (!isRoundComplete) return undefined;
    if (isLastRound) {
      setQuizEnded(true);
      return undefined;
    }

    setIsTransitioning(true);
    setStatusTone('success');
    setMicStatus(`Round ${currentRoundIndex + 1} complete! Next round coming up…`);

    const timeout = setTimeout(
      () => {
        setCurrentRoundIndex((r) => r + 1);
        setAnsweredList([]);
        setScore(0);
        setJustMatchedRowIndex(null);
        setFlashRowIndex(null);
        setLastTranscript('');
        setStatusTone('idle');
        setMicStatus('Tap the microphone and speak your answer…');
        setIsTransitioning(false);
      },
      prefersReducedMotion ? 0 : 1600
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoundComplete]);

  const resetRoundState = () => {
    setAnsweredList([]);
    setScore(0);
    setJustMatchedRowIndex(null);
    setFlashRowIndex(null);
    setLastTranscript('');
    setStatusTone('idle');
    setMicStatus('Tap the microphone and speak your answer…');
    setIsTransitioning(false);
    setQuizEnded(false);
  };

  const restartQuiz = () => {
    setHasStarted(false);
    setCurrentRoundIndex(0);
    resetRoundState();
    isFirstRoundCheckRef.current = true;
  };

  const stopListeningIfActive = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const skipRound = () => {
    stopListeningIfActive();
    if (isLastRound) {
      setQuizEnded(true);
      return;
    }
    setCurrentRoundIndex((r) => r + 1);
    resetRoundState();
  };

  // Steps back to the previous round's question; from round 1, there's
  // nothing before it, so it exits to the start screen instead.
  const goBack = () => {
    stopListeningIfActive();
    if (currentRoundIndex === 0) {
      restartQuiz();
      return;
    }
    setCurrentRoundIndex((r) => r - 1);
    resetRoundState();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F7F7FC] flex items-center justify-center p-6">
      <CelebrationConfetti trigger={quizEnded} reduceMotion={prefersReducedMotion} />
      <div
        className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#6D3CCB]/20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-[#4F8EF7]/20 blur-[110px]"
        aria-hidden="true"
      />

      {!hasStarted ? (
        <StartScreen onStart={() => setHasStarted(true)} reduceMotion={prefersReducedMotion} />
      ) : (
        <div
          className={`relative w-full max-w-xl flex flex-col gap-5 ${
            !prefersReducedMotion ? 'animate-rise-in' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-[#64748B] transition-colors duration-200 hover:bg-[#F5F2FF] hover:text-[#6D3CCB]"
            >
              <BackIcon />
              Back
            </button>
            <span className="flex items-center gap-1.5 pr-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6D3CCB]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D3CCB]">
                Round {currentRoundIndex + 1} of {ROUNDS.length} · {round.title}
              </span>
            </span>
          </div>

          <div className="rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_20px_50px_-20px_rgba(23,37,84,0.28)]">
            <div className="rounded-[20px] relative bg-[rgba(255,255,255,0.72)] backdrop-blur-md p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center ${!prefersReducedMotion ? 'animate-float' : ''}`}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6D3CCB]/40 via-[#A78BFA]/30 to-[#4F8EF7]/40 blur-md"
                      aria-hidden="true"
                    />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-[0_10px_24px_-8px_rgba(109,60,203,0.5)] ring-1 ring-[#E2E4F0]">
                      <img src="/half_logo.png" alt="Quiz logo" className="h-full w-full object-contain" />
                    </div>
                  </div>
                  <h1 className="text-lg font-bold leading-snug tracking-tight text-[#172554]">
                    {round.question}
                  </h1>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4F8EF7] to-[#A78BFA] px-4 py-1.5 text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,142,247,0.6)] transition-transform duration-300 ${
                    scoreBump && !prefersReducedMotion ? 'animate-score-bump' : ''
                  }`}
                >
                  <TrophyIcon />
                  {score} / {concepts.length}
                </span>
              </div>

              <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-[#E2E4F0] to-transparent" />

              <div className="flex flex-col gap-3.5 pl-2">
                {concepts.map((_, index) => (
                  <AnswerRow
                    key={`${round.id}-${index}`}
                    index={index}
                    concept={answeredList[index]}
                    isJustMatched={justMatchedRowIndex === index}
                    shouldFlash={flashRowIndex === index}
                    flashToken={flashToken}
                    reduceMotion={prefersReducedMotion}
                  />
                ))}
              </div>
            </div>
          </div>

          {!quizEnded ? (
            <div className="rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_14px_36px_-22px_rgba(23,37,84,0.32)]">
              <div className="rounded-[20px] flex items-center gap-4 bg-[rgba(255,255,255,0.72)] backdrop-blur-md px-5 py-4">
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={!speechSupported || isGrading || isTransitioning}
                  aria-pressed={isListening}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6D3CCB] to-[#7C4FE0] text-white shadow-[0_10px_24px_-6px_rgba(109,60,203,0.55)] transition-transform duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${
                    !isListening ? 'hover:scale-105 active:scale-95' : ''
                  } ${isListening && !prefersReducedMotion ? 'animate-mic-pulse' : ''}`}
                >
                  <MicIcon />
                </button>
                <div className="flex flex-1 flex-col gap-1">
                  <span className={`text-sm font-semibold transition-colors duration-300 ${STATUS_COLORS[statusTone]}`}>
                    {micStatus}
                  </span>
                  {isListening ? (
                    <Waveform levels={waveformLevels} reduceMotion={prefersReducedMotion} />
                  ) : null}
                  {isListening && interimText ? (
                    <span className="text-xs italic text-[#64748B]">“{interimText}…”</span>
                  ) : lastTranscript ? (
                    <span className="text-xs text-[#64748B]">“{lastTranscript}”</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={skipRound}
                  disabled={isGrading || isTransitioning}
                  className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[#64748B] transition-colors duration-200 hover:bg-[#F5F2FF] hover:text-[#6D3CCB] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLastRound ? 'End quiz' : 'Skip'}
                  <SkipIcon />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center justify-between gap-4 rounded-2xl border border-[#DED0FA] bg-gradient-to-r from-[#F1EDFF] to-[#F5F2FF] px-5 py-4 shadow-[0_14px_36px_-22px_rgba(109,60,203,0.4)] ${
                !prefersReducedMotion ? 'animate-celebrate' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  🎉
                </span>
                <span className="text-sm font-bold text-[#172554]">You've completed the AI Awareness Quiz!</span>
              </div>
              <button
                type="button"
                onClick={restartQuiz}
                className="shrink-0 rounded-full bg-gradient-to-r from-[#6D3CCB] to-[#4F8EF7] px-4 py-1.5 text-xs font-bold text-white shadow-[0_6px_16px_-6px_rgba(109,60,203,0.5)] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
