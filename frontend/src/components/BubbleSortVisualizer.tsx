"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SortStep {
    array: number[];
    comparing: number[]; // Indices being compared
    swapping: boolean;   // Are they swapping?
    sorted: number[];    // Indices that are sorted
    description: string;
}

export default function BubbleSortVisualizer() {
    const [array, setArray] = useState<number[]>([]);
    const [steps, setSteps] = useState<SortStep[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState<number>(1000);
    const [arraySize, setArraySize] = useState<number>(10);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize random array
    const generateArray = useCallback(() => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
        setArray(newArray);
        setSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
        setIsPaused(false);
    }, [arraySize]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    // Bubble Sort Algorithm to generate steps
    const generateSteps = () => {
        const arr = [...array];
        const newSteps: SortStep[] = [];
        const n = arr.length;
        const sortedIndices: number[] = [];

        // Initial step
        newSteps.push({
            array: [...arr],
            comparing: [],
            swapping: false,
            sorted: [],
            description: "Starting Bubble Sort on the array."
        });

        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                // Comparison step
                newSteps.push({
                    array: [...arr],
                    comparing: [j, j + 1],
                    swapping: false,
                    sorted: [...sortedIndices],
                    description: `Comparing ${arr[j]} and ${arr[j + 1]}. Is ${arr[j]} > ${arr[j + 1]}?`
                });

                if (arr[j] > arr[j + 1]) {
                    // Swap step
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;

                    newSteps.push({
                        array: [...arr],
                        comparing: [j, j + 1],
                        swapping: true,
                        sorted: [...sortedIndices],
                        description: `Yes, ${arr[j + 1]} > ${arr[j]} (was ${arr[j]}). Swapping them!`
                    });
                } else {
                    newSteps.push({
                        array: [...arr],
                        comparing: [j, j + 1],
                        swapping: false,
                        sorted: [...sortedIndices],
                        description: `No, ${arr[j]} < ${arr[j + 1]}. No swap needed.`
                    });
                }
            }
            sortedIndices.push(n - 1 - i);

            // End of pass step
            newSteps.push({
                array: [...arr],
                comparing: [],
                swapping: false,
                sorted: [...sortedIndices],
                description: `Pass complete. ${arr[n - 1 - i]} is now in its sorted position.`
            });

            if (!swapped) {
                // Optimization: if no swaps, array is sorted
                // Mark remaining as sorted
                for (let k = 0; k < n - 1 - i; k++) {
                    sortedIndices.push(k);
                }
                break;
            }
        }

        // Ensure all are marked sorted at the end
        if (sortedIndices.length < n) {
            for (let k = 0; k < n; k++) {
                if (!sortedIndices.includes(k)) sortedIndices.push(k);
            }
        }

        // Final step
        newSteps.push({
            array: [...arr],
            comparing: [],
            swapping: false,
            sorted: Array.from({ length: n }, (_, i) => i),
            description: "Array is fully sorted!"
        });

        setSteps(newSteps);
        setCurrentStep(1); // Start from first actual action
        setIsPlaying(true);
        setIsPaused(false);
    };

    // Play control
    useEffect(() => {
        if (isPlaying && !isPaused && currentStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timer);
        } else if (currentStep === steps.length - 1) {
            setIsPlaying(false);
        }
    }, [isPlaying, isPaused, currentStep, steps.length, speed]);

    // Scroll handling (Keyboard/Mouse)
    useEffect(() => {
        if (!isPlaying && steps.length > 0) return; // Allow manual control if steps generated

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setIsPaused(true);
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentStep > 0) {
                    setCurrentStep(prev => prev - 1);
                    setIsPaused(true);
                }
            } else if (e.key === ' ') {
                e.preventDefault();
                setIsPaused(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, steps.length, isPlaying]);


    const activeStep = steps[currentStep] || { array, comparing: [], swapping: false, sorted: [], description: "Ready to sort" };

    return (
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 pb-20 space-y-12">

            {/* Controls */}
            <div className="glass-card w-full p-6 animate-fade-in-scale border-2 border-purple-500/30 z-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={generateArray}
                            disabled={isPlaying && !isPaused}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all font-bold"
                        >
                            🎲 Randomize
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400">Size:</span>
                            <input
                                type="range"
                                min="5"
                                max="20"
                                value={arraySize}
                                onChange={(e) => setArraySize(Number(e.target.value))}
                                disabled={isPlaying && !isPaused}
                                className="w-24 accent-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isPlaying && steps.length === 0 ? (
                            <button
                                onClick={generateSteps}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all animate-pulse"
                            >
                                ▶ Start Sort
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (currentStep > 0) {
                                            setCurrentStep(prev => prev - 1);
                                            setIsPaused(true);
                                        }
                                    }}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-xl"
                                    title="Previous Step"
                                >
                                    ⏮️
                                </button>
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="px-6 py-3 bg-purple-500/20 border border-purple-500 rounded-xl hover:bg-purple-500/30 transition-all font-bold min-w-[120px]"
                                >
                                    {isPaused || !isPlaying ? '▶ Resume' : '⏸ Pause'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) {
                                            setCurrentStep(prev => prev + 1);
                                            setIsPaused(true);
                                        }
                                    }}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-xl"
                                    title="Next Step"
                                >
                                    ⏭️
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-400">Speed:</span>
                        <div className="flex gap-1">
                            <button onClick={() => setSpeed(1500)} className={`px-2 py-1 text-xs rounded ${speed === 1500 ? 'bg-purple-500' : 'bg-neutral-800'}`}>0.5x</button>
                            <button onClick={() => setSpeed(1000)} className={`px-2 py-1 text-xs rounded ${speed === 1000 ? 'bg-purple-500' : 'bg-neutral-800'}`}>1x</button>
                            <button onClick={() => setSpeed(500)} className={`px-2 py-1 text-xs rounded ${speed === 500 ? 'bg-purple-500' : 'bg-neutral-800'}`}>2x</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualizer Area */}
            <div className="w-full relative min-h-[400px] flex items-end justify-center gap-2 md:gap-4 p-8 glass-card border border-cyan-500/20 shadow-2xl overflow-hidden" ref={containerRef}>
                {/* Background grid visualization */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {activeStep.array.map((value, idx) => {
                    const isComparing = activeStep.comparing.includes(idx);
                    const isSwapping = activeStep.swapping && isComparing;
                    const isSorted = activeStep.sorted.includes(idx);

                    let barColor = "bg-neutral-600";
                    let glow = "";
                    let transform = "";

                    if (isSorted) {
                        barColor = "bg-cyan-500";
                        glow = "shadow-[0_0_15px_rgba(6,182,212,0.6)]";
                    } else if (isSwapping) {
                        barColor = "bg-red-500";
                        glow = "shadow-[0_0_20px_rgba(239,68,68,0.8)]";
                        // Simple shake animation for swapping
                        transform = "animate-bounce";
                    } else if (isComparing) {
                        barColor = "bg-purple-500";
                        glow = "shadow-[0_0_15px_rgba(168,85,247,0.6)]";
                        transform = "scale-y-105 origin-bottom";
                    }

                    const heightPercentage = Math.max((value / 100) * 100, 5); // ensure at least 5% height

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 w-full max-w-[60px] relative z-10 transition-all duration-500 ease-in-out">
                            <div className="text-xs md:text-sm font-bold text-neutral-400 mb-1">{value}</div>
                            <div
                                className={`w-full rounded-t-lg transition-all duration-300 ${barColor} ${glow} ${transform}`}
                                style={{ height: `${heightPercentage * 3}px` }}
                            ></div>
                            <div className="text-xs text-neutral-600 mt-2">{idx}</div>
                        </div>
                    );
                })}
            </div>

            {/* Explanation Card */}
            <div className="w-full max-w-3xl glass-card p-8 border-l-4 border-purple-500 animate-slide-in-up">
                <h3 className="text-xl font-bold text-purple-300 mb-2">Step {currentStep} of {steps.length > 0 ? steps.length - 1 : '?'}</h3>
                <p className="text-2xl font-light text-white leading-relaxed">
                    {activeStep.description}
                </p>
                {activeStep.swapping && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg inline-block animate-pulse">
                        ⚠️ Swap Performed
                    </div>
                )}
                {activeStep.sorted.length > 0 && currentStep === steps.length - 1 && (
                    <div className="mt-4 p-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg inline-block animate-bounce">
                        🎉 Comparison Complete
                    </div>
                )}
            </div>

        </div>
    );
}
