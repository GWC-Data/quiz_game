import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ROUNDS, QUIZ_TITLE } from './quizConfig';
import { gradeAnswer } from './gradeAnswer';
import { primeAudio, playCorrectSound, playWrongSound } from './sounds';

const STATUS_COLORS = {
  idle: 'text-[#64748B]',
  listening: 'text-[#6D3CCB]',
  thinking: 'text-[#4F8EF7]',
  success: 'text-emerald-600',
  error: 'text-red-500',
};

function MicIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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

function ChevronIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${className}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    'absolute -left-3.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold shadow-md ring-2 transition-all duration-300',
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
    <div className="relative flex-1">
      <ConfettiBurst trigger={isJustMatched} reduceMotion={reduceMotion} />
      <span className={badgeClasses}>{index + 1}</span>
      <div className={`h-full rounded-2xl p-[1.5px] transition-all duration-300 ${borderWrapperClasses}`}>
        <div
          className={`flex h-full items-center gap-3 rounded-2xl pl-7 pr-3 transition-all duration-300 ${
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
    <div className={`relative w-full max-w-md flex flex-col items-center gap-6 ${!reduceMotion ? 'animate-rise-in' : ''}`}>
      <div className="w-full rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_20px_50px_-20px_rgba(23,37,84,0.28)]">
        <div className="rounded-[20px] flex flex-col items-center gap-8 bg-[rgba(255,255,255,0.72)] backdrop-blur-md px-8 py-16 text-center sm:px-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#172554] sm:text-4xl">{QUIZ_TITLE}</h1>

          <button
            type="button"
            onClick={onStart}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6D3CCB] to-[#4F8EF7] px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-8px_rgba(109,60,203,0.6)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
          >
            <PlayIcon />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// Right-side accordion: one row per answer slot, in rank order. Locked
// (unanswered) slots stay collapsed and unlabeled so they don't spoil the
// answer; answered slots can be expanded to read the fact behind them, and
// the most recently answered one auto-expands.
function FactsPanel({ concepts, answeredByRank, openIndex, onToggle, reduceMotion }) {
  return (
    <div className="flex flex-col gap-2">
      {concepts.map((_, index) => {
        const concept = answeredByRank[index];
        const isAnswered = Boolean(concept);
        const isOpen = isAnswered && openIndex === index;

        return (
          <div
            key={index}
            className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
              isAnswered ? 'border-[#DED0FA] bg-[#F1EDFF]/70' : 'border-[#E2E4F0] bg-white/50'
            }`}
          >
            <button
              type="button"
              onClick={() => isAnswered && onToggle(index)}
              disabled={!isAnswered}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isAnswered ? 'bg-[#6D3CCB] text-white' : 'bg-[#E2E4F0] text-[#64748B]'
                  }`}
                >
                  {index + 1}
                </span>
                {isAnswered ? concept.label : 'Locked'}
              </span>
              {isAnswered ? (
                <ChevronIcon className={isOpen ? 'rotate-180 text-[#6D3CCB]' : 'text-[#64748B]'} />
              ) : null}
            </button>
            <div
              className={`grid ${reduceMotion ? '' : 'transition-[grid-template-rows] duration-300 ease-out'}`}
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="px-4 pb-3 text-xs leading-relaxed text-[#64748B]">{concept?.description}</p>
                {concept?.source ? (
                  <p className="px-4 pb-4 text-[10px] font-semibold uppercase tracking-wide text-[#6D3CCB]">
                    Source: {concept.source}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function VoiceQuiz() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [answeredByRank, setAnsweredByRank] = useState(() => Array(ROUNDS[0].concepts.length).fill(null));
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
  const [wrongFlashToken, setWrongFlashToken] = useState(0);
  const [openFactIndex, setOpenFactIndex] = useState(null);
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

  const score = useMemo(() => answeredByRank.filter(Boolean).length, [answeredByRank]);
  const remainingConcepts = useMemo(
    () => concepts.filter((c) => !answeredByRank[c.rank - 1]),
    [answeredByRank, concepts]
  );
  const isRoundComplete = score === concepts.length;

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
          const rowIndex = concept.rank - 1;
          setAnsweredByRank((prev) => {
            const next = [...prev];
            next[rowIndex] = concept;
            return next;
          });
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
          setWrongFlashToken((t) => t + 1);
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
    [remainingConcepts, concepts, prefersReducedMotion]
  );

  // Auto-expand the fact for whichever slot was just matched.
  useEffect(() => {
    if (justMatchedRowIndex != null) {
      setOpenFactIndex(justMatchedRowIndex);
    }
  }, [justMatchedRowIndex]);

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

  // Uses the browser's built-in speech recognition (Chromium/Chrome, Edge)
  // rather than a bundled model — simplest and most reliable option where
  // it's supported.
  useEffect(() => {
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      setSpeechSupported(false);
      setStatusTone('idle');
      setMicStatus('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return undefined;
    }

    const recognition = new SpeechRecognitionImpl();
    // continuous + interim results so recognition keeps listening across pauses
    // instead of cutting off after the first short phrase, and the UI can show
    // a live caption while the user is still speaking.
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    // Ask for multiple hypotheses per phrase, not just the top guess — short
    // answers like product/brand names are exactly where speech recognition
    // is least confident, and the grader (keyword + LLM matching) has a much
    // better shot when it sees several candidate phrasings instead of one.
    recognition.maxAlternatives = 5;

    recognition.onresult = (event) => {
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) {
          const alternatives = new Set();
          for (let a = 0; a < res.length; a += 1) {
            const alt = res[a]?.transcript?.trim();
            if (alt) alternatives.add(alt);
          }
          finalTranscriptRef.current += `${[...alternatives].join(' / ')} `;
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
        setAnsweredByRank(Array(concepts.length).fill(null));
        setJustMatchedRowIndex(null);
        setOpenFactIndex(null);
        setWrongFlashToken(0);
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
    setAnsweredByRank(Array(concepts.length).fill(null));
    setJustMatchedRowIndex(null);
    setOpenFactIndex(null);
    setWrongFlashToken(0);
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
    <div
      className={`relative h-screen w-full overflow-hidden bg-[#F7F7FC] ${
        hasStarted ? 'flex' : 'flex items-center justify-center p-6'
      }`}
    >
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
          className={`relative z-10 flex h-full min-h-0 w-full flex-col gap-3 p-3 sm:p-4 lg:flex-row ${
            !prefersReducedMotion ? 'animate-rise-in' : ''
          }`}
        >
          {/* Main question column — fills the full available height */}
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex shrink-0 items-center justify-between gap-2">
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

            <div className="flex min-h-0 flex-1 rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_20px_50px_-20px_rgba(23,37,84,0.28)]">
              <div className="flex min-h-0 flex-1 flex-col rounded-[20px] bg-[rgba(255,255,255,0.72)] backdrop-blur-md p-4 sm:p-5">
                <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center ${!prefersReducedMotion ? 'animate-float' : ''}`}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6D3CCB]/40 via-[#A78BFA]/30 to-[#4F8EF7]/40 blur-md"
                        aria-hidden="true"
                      />
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_10px_24px_-8px_rgba(109,60,203,0.5)] ring-1 ring-[#E2E4F0]">
                        <img src="/half_logo.png" alt="Quiz logo" className="h-full w-full object-contain" />
                      </div>
                    </div>
                    <h1 className="text-base font-bold leading-snug tracking-tight text-[#172554] sm:text-lg">
                      {round.question}
                    </h1>
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4F8EF7] to-[#A78BFA] px-3 py-1 text-xs font-bold text-white shadow-[0_6px_16px_-6px_rgba(79,142,247,0.6)] transition-transform duration-300 ${
                      scoreBump && !prefersReducedMotion ? 'animate-score-bump' : ''
                    }`}
                  >
                    <TrophyIcon />
                    {score} / {concepts.length}
                  </span>
                </div>

                <div className="mb-3 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[#E2E4F0] to-transparent" />

                <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pl-2 pr-1">
                  {concepts.map((_, index) => (
                    <AnswerRow
                      key={`${round.id}-${index}`}
                      index={index}
                      concept={answeredByRank[index]}
                      isJustMatched={justMatchedRowIndex === index}
                      shouldFlash={wrongFlashToken > 0 && !answeredByRank[index]}
                      flashToken={wrongFlashToken}
                      reduceMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </div>
            </div>

            {!quizEnded ? (
              <div className="shrink-0 rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_14px_36px_-22px_rgba(23,37,84,0.32)]">
                <div className="rounded-[20px] flex flex-col items-center gap-2 bg-[rgba(255,255,255,0.72)] backdrop-blur-md px-5 py-3">
                  <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
                    <div aria-hidden="true" />
                    <button
                      type="button"
                      onClick={toggleMic}
                      disabled={!speechSupported || isGrading || isTransitioning}
                      aria-pressed={isListening}
                      aria-label={isListening ? 'Stop listening' : 'Start listening'}
                      className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6D3CCB] to-[#7C4FE0] text-white shadow-[0_14px_32px_-8px_rgba(109,60,203,0.6)] transition-transform duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${
                        !isListening ? 'hover:scale-105 active:scale-95' : ''
                      } ${isListening && !prefersReducedMotion ? 'animate-mic-pulse' : ''}`}
                    >
                      <MicIcon className="h-6 w-6" />
                    </button>
                    <div className="flex justify-end">
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

                  <div className="flex flex-col items-center gap-1.5 text-center">
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
                </div>
              </div>
            ) : (
              <div
                className={`flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-[#DED0FA] bg-gradient-to-r from-[#F1EDFF] to-[#F5F2FF] px-5 py-4 shadow-[0_14px_36px_-22px_rgba(109,60,203,0.4)] ${
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

          {/* Right-side facts accordion */}
          <div className="flex min-h-0 w-full shrink-0 flex-col lg:w-[340px] xl:w-[380px]">
            <div className="flex min-h-0 flex-1 rounded-[20px] bg-gradient-to-r from-[#6D3CCB] via-[#A78BFA] to-[#4F8EF7] p-[2px] shadow-[0_20px_50px_-20px_rgba(23,37,84,0.28)]">
              <div className="flex min-h-0 flex-1 flex-col rounded-[20px] bg-[rgba(255,255,255,0.72)] backdrop-blur-md">
                <div className="shrink-0 border-b border-[#E2E4F0]/70 px-5 py-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6D3CCB]">Fun Facts</span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3">
                  <FactsPanel
                    concepts={concepts}
                    answeredByRank={answeredByRank}
                    openIndex={openFactIndex}
                    onToggle={(index) => setOpenFactIndex((cur) => (cur === index ? null : index))}
                    reduceMotion={prefersReducedMotion}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
