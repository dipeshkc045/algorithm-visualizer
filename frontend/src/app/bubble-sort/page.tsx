import BubbleSortVisualizer from '@/components/BubbleSortVisualizer';
import Link from 'next/link';

export default function BubbleSortPage() {
    return (
        <div className="min-h-screen relative">
            {/* Back Navigation - Fixed positioning */}
            <div className="fixed top-6 left-6 z-50">
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 glass-card px-8 py-4 border-2 border-purple-500/50 hover:border-purple-500 transition-all hover:scale-105 shadow-xl hover:shadow-purple-500/50"
                >
                    <span className="text-3xl">←</span>
                    <span className="font-bold text-lg">Back to Home</span>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="text-center pt-24 pb-12 px-4">
                <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent gradient-shift">
                    BUBBLE SORT
                </h1>
                <p className="text-2xl text-neutral-300 mb-2">Sorting Visualization</p>
                <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                    Watch elements "bubble up" to their correct positions through repeated swaps
                </p>
            </div>

            {/* Visualizer */}
            <div className="relative z-10">
                <BubbleSortVisualizer />
            </div>
        </div>
    );
}
