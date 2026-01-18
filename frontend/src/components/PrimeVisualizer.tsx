"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PrimeStep {
    divisor: number;
    expression: string;
    result: string;
    isMatch: boolean;
    status: string;
}

interface PrimeResult {
    number: number;
    isPrime: boolean;
    steps: PrimeStep[];
    timeTakenMs: number;
    message: string;
}

export default function PrimeVisualizer() {
    const [number, setNumber] = useState<string>("");
    const [result, setResult] = useState<PrimeResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState<number>(3000); // 3 seconds per step (slower default)
    const [showFinalResult, setShowFinalResult] = useState(false);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    const checkPrime = async () => {
        if (!number || isNaN(Number(number))) return;
        setLoading(true);
        setResult(null);
        setCurrentStep(-1);
        setShowFinalResult(false);
        setIsPaused(false);
        stepRefs.current = [];

        try {
            const res = await fetch(`http://localhost:8080/api/prime/check?n=${number}`);
            const data = await res.json();
            setResult(data);
            setIsPlaying(true);
        } catch (error) {
            console.error("Failed to fetch:", error);
            alert("Backend not reachable. Make sure Spring Boot is running on port 8080.");
        } finally {
            setLoading(false);
        }
    };

    // Create particle effect
    const createParticles = useCallback((x: number, y: number) => {
        if (!particlesRef.current) return;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDelay = `${i * 0.1}s`;
            particlesRef.current.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }, []);

    // Auto-scroll to current step with smooth animation
    useEffect(() => {
        if (currentStep >= 0 && stepRefs.current[currentStep]) {
            const element = stepRefs.current[currentStep];
            element?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });

            // Create particle effect at step location
            const rect = element?.getBoundingClientRect();
            if (rect) {
                createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        }
    }, [currentStep, createParticles]);

    // Step progression with timing and pause support
    useEffect(() => {
        if (isPlaying && !isPaused && result) {
            if (currentStep < result.steps.length - 1) {
                const timer = setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                }, speed);
                return () => clearTimeout(timer);
            } else if (currentStep === result.steps.length - 1) {
                const finalTimer = setTimeout(() => {
                    setShowFinalResult(true);
                    setIsPlaying(false);
                }, speed);
                return () => clearTimeout(finalTimer);
            }
        }
    }, [isPlaying, isPaused, result, currentStep, speed]);

    // Scroll-based navigation - improved for smooth bidirectional control
    useEffect(() => {
        if (!result || currentStep < 0) return;

        let lastScrollTime = 0;
        const scrollDelay = 800; // Minimum time between scroll actions (ms)

        const handleWheel = (e: WheelEvent) => {
            const now = Date.now();

            // Only process if enough time has passed since last scroll
            if (now - lastScrollTime < scrollDelay) {
                return;
            }

            // Scroll down = next step
            if (e.deltaY > 0) {
                if (currentStep < result.steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setIsPaused(true); // Pause auto-play when manually scrolling
                    lastScrollTime = now;
                } else if (currentStep === result.steps.length - 1 && !showFinalResult) {
                    setShowFinalResult(true);
                    setIsPlaying(false);
                    lastScrollTime = now;
                }
            }
            // Scroll up = previous step
            else if (e.deltaY < 0) {
                if (showFinalResult) {
                    setShowFinalResult(false);
                    lastScrollTime = now;
                } else if (currentStep > 0) {
                    setCurrentStep(prev => prev - 1);
                    setIsPaused(true); // Pause auto-play when manually scrolling
                    lastScrollTime = now;
                }
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [result, currentStep, showFinalResult]);

    const togglePause = () => setIsPaused(!isPaused);
    const restart = () => {
        setCurrentStep(-1);
        setShowFinalResult(false);
        setIsPlaying(true);
        setIsPaused(false);
    };

    const skipToEnd = () => {
        if (result) {
            setCurrentStep(result.steps.length - 1);
            setShowFinalResult(true);
            setIsPlaying(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Particle container */}
            <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-50"></div>

            <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-8 space-y-12 relative z-10">
                {/* Input Section - Floating Card */}
                <div className="relative z-40 w-full max-w-xl mx-auto mb-12">
                    <div className="glass-card p-2 flex gap-2 shadow-2xl shadow-purple-900/40 border border-purple-500/30">
                        <input
                            type="number"
                            min="2"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Enter a number..."
                            className="flex-1 bg-transparent border-none text-white text-xl px-4 focus:ring-0 placeholder-neutral-500 font-bold"
                            onKeyDown={(e) => e.key === 'Enter' && checkPrime()}
                        />
                        <button
                            onClick={checkPrime}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                        >
                            {loading ? '...' : 'CHECK PRIMALITY'}
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                {!result && !loading && (
                    <div className="text-center animate-fade-in-scale">
                        <div className="inline-block p-12 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <div className="text-6xl mb-6">🔢</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Ready to Initialize</h3>
                            <p className="text-neutral-400 mb-8">Enter a number above to start the visualization</p>
                            <div className="flex justify-center gap-4">
                                {[17, 29, 35, 97].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => checkPrime(num)}
                                        className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-purple-600/20 hover:text-purple-400 border border-neutral-700 hover:border-purple-500 transition-all font-mono"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Visualization Content */}
                {result && (
                    <div className="w-full relative">

                        {/* Header Info */}
                        <div className="text-center mb-12 animate-fade-in-scale relative z-10">
                            <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent gradient-shift">
                                Analyzing {result.number}
                            </h2>
                            <p className="text-neutral-300 text-2xl font-light">Trial Division Algorithm</p>
                            <div className="mt-4 inline-block px-6 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
                                <span className="text-purple-300">Testing divisors: 2 to √{result.number} ≈ {Math.floor(Math.sqrt(result.number))}</span>
                            </div>
                        </div>

                        {/* Controls Bar - No longer sticky to prevent overlap */}
                        <div className="glass-card w-full max-w-4xl mx-auto p-4 mb-20 border-2 border-purple-500/20 relative z-30">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                {/* Progress */}
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between text-xs text-neutral-400 mb-2 font-mono">
                                        <span>Step {Math.max(0, currentStep + 1)} of {result.steps.length}</span>
                                        <span>{Math.round((Math.max(0, currentStep + 1) / result.steps.length) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 relative"
                                            style={{ width: `${(Math.max(0, currentStep + 1) / result.steps.length) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={togglePause}
                                            className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg hover:bg-purple-500/30 transition-all min-w-[100px] flex items-center justify-center gap-2 font-bold text-purple-300"
                                        >
                                            {isPaused ? '▶ Resume' : '⏸ Pause'}
                                        </button>
                                        <button
                                            onClick={restart}
                                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-lg hover:bg-cyan-500/30 transition-all flex items-center gap-2"
                                        >
                                            🔄 Restart
                                        </button>
                                        <button
                                            onClick={skipToEnd}
                                            className="px-4 py-2 bg-pink-500/20 border border-pink-500 rounded-lg hover:bg-pink-500/30 transition-all flex items-center gap-2"
                                        >
                                            ⏭ Skip
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-neutral-400">Speed:</span>
                                        <button
                                            onClick={() => setSpeed(5000)}
                                            className={`px-3 py-1 rounded-lg transition-all ${speed === 5000 ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}
                                        >
                                            Slow
                                        </button>
                                        <button
                                            onClick={() => setSpeed(3000)}
                                            className={`px-3 py-1 rounded-lg transition-all ${speed === 3000 ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}
                                        >
                                            Normal
                                        </button>
                                        <button
                                            onClick={() => setSpeed(1500)}
                                            className={`px-3 py-1 rounded-lg transition-all ${speed === 1500 ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}
                                        >
                                            Fast
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Scroll Hint inside controls */}
                            <div className="mt-4 flex justify-center items-center gap-2 text-xs text-cyan-400/80">
                                <span className="animate-bounce">↕</span>
                                <span>Scroll to navigate steps</span>
                            </div>
                        </div>

                        {/* Steps Timeline */}
                        <div className="relative space-y-10">
                            {result.steps.map((step, idx) => {
                                const isActive = idx === currentStep;
                                const isPast = idx < currentStep;
                                const isFuture = idx > currentStep;

                                return (
                                    <div
                                        key={idx}
                                        ref={(el) => (stepRefs.current[idx] = el)}
                                        className={`transition-all duration-2000 transform ${isFuture ? 'opacity-10 scale-90 blur-md translate-y-8' :
                                            isPast ? 'opacity-50 scale-95' :
                                                'opacity-100 scale-100'
                                            }`}
                                    >
                                        <div className="flex items-start gap-8">
                                            {/* Step Badge */}
                                            <div className="flex-shrink-0 w-36 pt-10">
                                                <div className={`inline-flex items-center justify-center px-5 py-3 rounded-2xl border-2 transition-all duration-1500 ${isActive
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 shadow-2xl shadow-purple-500/60 scale-125 animate-shimmer'
                                                    : isPast
                                                        ? 'bg-purple-500/20 border-purple-500/40'
                                                        : 'bg-neutral-900/80 border-neutral-700'
                                                    }`}>
                                                    <span className={`text-base font-black tracking-wider ${isActive ? 'text-white' : 'text-purple-300'
                                                        }`}>
                                                        {idx === 0 ? '🚀 START' :
                                                            idx === result.steps.length - 1 ? '🎯 END' :
                                                                `⚡ STEP ${idx}`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Step Card */}
                                            <div className={`glass-card flex-1 p-10 border-2 transition-all duration-2000 relative overflow-hidden ${isActive
                                                ? step.isMatch
                                                    ? 'border-red-500 bg-red-500/15 shadow-2xl shadow-red-500/40 scale-105'
                                                    : 'border-cyan-500 bg-cyan-500/10 shadow-2xl shadow-cyan-500/40 scale-105'
                                                : isPast
                                                    ? step.isMatch
                                                        ? 'border-red-500/20 bg-red-500/5'
                                                        : 'border-purple-500/20 bg-purple-500/5'
                                                    : 'border-neutral-700/50 bg-neutral-900/30'
                                                }`}>
                                                {/* Animated background effect */}
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                                                )}

                                                {/* Status Badge */}
                                                <div className="flex items-center justify-between mb-6 relative z-10">
                                                    <div className="text-base text-neutral-300 font-medium">
                                                        {step.divisor > 0 && (
                                                            <span className="flex items-center gap-2">
                                                                Testing divisor:
                                                                <span className="text-3xl font-black text-purple-300 bg-purple-500/20 px-4 py-1 rounded-lg border border-purple-500/30">
                                                                    {step.divisor}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`text-sm font-bold px-5 py-2 rounded-full transition-all duration-700 ${isActive
                                                        ? step.isMatch
                                                            ? 'bg-red-600 text-white shadow-xl shadow-red-500/60 animate-bounce scale-110'
                                                            : 'bg-cyan-600 text-white shadow-xl shadow-cyan-500/60 scale-110'
                                                        : step.isMatch
                                                            ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                                            : 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                                                        }`}>
                                                        {step.status}
                                                    </span>
                                                </div>

                                                {/* Expression */}
                                                <div className={`mb-6 transition-all duration-700 relative z-10 ${isActive ? 'scale-105' : 'scale-100'
                                                    }`}>
                                                    <div className="text-4xl font-mono font-black text-purple-100 mb-4 tracking-wide">
                                                        {step.expression}
                                                    </div>

                                                    {step.divisor > 0 && (
                                                        <div className="flex items-center gap-6 mt-6">
                                                            <div className="text-3xl text-neutral-400 font-bold">=</div>
                                                            <div className={`text-7xl font-black transition-all duration-2000 ${isActive
                                                                ? step.isMatch
                                                                    ? 'text-red-400 animate-bounce drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]'
                                                                    : 'text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]'
                                                                : step.isMatch
                                                                    ? 'text-red-500/60'
                                                                    : 'text-cyan-400/60'
                                                                }`}>
                                                                {step.result}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Explanation */}
                                                {step.divisor > 0 && (
                                                    <div className={`mt-6 p-6 rounded-xl transition-all duration-700 relative z-10 ${step.isMatch
                                                        ? 'bg-red-500/20 border-2 border-red-500/50'
                                                        : 'bg-cyan-500/10 border-2 border-cyan-500/30'
                                                        }`}>
                                                        {step.isMatch ? (
                                                            <div className="text-red-300 font-bold text-xl flex items-center gap-3">
                                                                <span className="text-3xl">✕</span>
                                                                <span>{result.number} is divisible by {step.divisor} → <span className="text-red-400">NOT PRIME!</span></span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-cyan-300 text-xl flex items-center gap-3">
                                                                <span className="text-3xl">✓</span>
                                                                <span>{result.number} is not divisible by {step.divisor} → Continue checking...</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Animated Connector */}
                                        {idx < result.steps.length - 1 && (
                                            <div className="flex items-center gap-8 my-8">
                                                <div className="w-36"></div>
                                                <div className="relative">
                                                    <div className={`w-3 h-20 rounded-full transition-all duration-2000 ${isPast
                                                        ? 'bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 shadow-lg shadow-purple-500/50'
                                                        : isActive
                                                            ? 'bg-gradient-to-b from-cyan-500 to-purple-500 animate-flow-pulse shadow-xl shadow-cyan-500/60'
                                                            : 'bg-neutral-700/50'
                                                        }`}></div>
                                                    {isActive && (
                                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-bounce">
                                                            ⬇️
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Final Result */}
                            {showFinalResult && (
                                <div
                                    className="flex items-center gap-8 animate-fade-in-scale mt-20"
                                    ref={(el) => {
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                >
                                    <div className="w-36"></div>
                                    <div className={`glass-card flex-1 p-16 border-4 ${result.isPrime
                                        ? 'border-cyan-500 cyan-glow-pulse bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
                                        : 'border-red-500 glow-pulse bg-gradient-to-br from-red-500/20 to-pink-500/20'
                                        } shadow-2xl relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                                        <div className="flex items-center gap-12 relative z-10">
                                            <div className={`text-9xl animate-bounce ${result.isPrime ? 'text-cyan-400' : 'text-red-500'} drop-shadow-[0_0_50px_currentColor]`}>
                                                {result.isPrime ? '✓' : '✕'}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-7xl font-black uppercase tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6 gradient-shift">
                                                    {result.isPrime ? 'PRIME NUMBER' : 'NOT PRIME'}
                                                </h3>
                                                <p className="text-3xl text-neutral-200 mb-8 font-light">{result.message}</p>
                                                <div className="flex items-center gap-8 text-xl text-neutral-400">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-2xl">⚡</span>
                                                        {result.timeTakenMs}ms
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-2xl">📊</span>
                                                        {result.steps.length} steps
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!result && !loading && (
                    <div className="text-center mt-32 space-y-8 animate-fade-in-scale">
                        <div className="text-9xl animate-bounce drop-shadow-[0_0_30px_rgba(188,19,254,0.6)]">🔢</div>
                        <h3 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Enter a Number to Begin
                        </h3>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                            Experience the trial division algorithm with cinematic animations, interactive controls, and real-time visualization
                        </p>
                        <div className="flex gap-4 justify-center mt-12">
                            {[17, 29, 35, 97].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setNumber(String(num))}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/50 rounded-xl hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all text-lg font-bold"
                                >
                                    Try {num}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
