"use client";

import Link from 'next/link';
import React from 'react';

interface AlgorithmCardProps {
    title: string;
    description: string;
    category: 'math' | 'sorting' | 'searching' | 'graph' | 'dp' | 'data-structures';
    difficulty: 'easy' | 'medium' | 'hard';
    route: string;
    icon: string;
    available?: boolean;
}

const categoryColors = {
    math: {
        border: 'border-purple-500',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        glow: 'shadow-purple-500/50',
    },
    sorting: {
        border: 'border-cyan-500',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/50',
    },
    searching: {
        border: 'border-pink-500',
        bg: 'bg-pink-500/10',
        text: 'text-pink-400',
        glow: 'shadow-pink-500/50',
    },
    graph: {
        border: 'border-green-500',
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        glow: 'shadow-green-500/50',
    },
    dp: {
        border: 'border-orange-500',
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        glow: 'shadow-orange-500/50',
    },
    'data-structures': {
        border: 'border-blue-500',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        glow: 'shadow-blue-500/50',
    },
};

const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    hard: 'bg-red-500/20 text-red-400 border-red-500',
};

export default function AlgorithmCard({
    title,
    description,
    category,
    difficulty,
    route,
    icon,
    available = true,
}: AlgorithmCardProps) {
    const colors = categoryColors[category];
    const CardWrapper = available ? Link : 'div';

    return (
        <CardWrapper
            href={available ? route : '#'}
            className={`group glass-card p-6 border-2 ${colors.border} ${colors.bg} 
                transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colors.glow}
                ${available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                relative overflow-hidden`}
        >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer"></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{icon}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[difficulty]}`}>
                        {difficulty.toUpperCase()}
                    </div>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black mb-2 ${colors.text} group-hover:scale-105 transition-transform duration-300`}>
                    {title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
                        {category.replace('-', ' ')}
                    </span>

                    {available ? (
                        <span className={`text-sm font-bold ${colors.text} group-hover:translate-x-2 transition-transform duration-300`}>
                            Try Now →
                        </span>
                    ) : (
                        <span className="text-xs text-neutral-600 font-semibold">
                            Coming Soon
                        </span>
                    )}
                </div>
            </div>

            {/* Not available overlay */}
            {!available && (
                <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-20">
                    <span className="text-neutral-500 font-bold text-lg">Coming Soon</span>
                </div>
            )}
        </CardWrapper>
    );
}
