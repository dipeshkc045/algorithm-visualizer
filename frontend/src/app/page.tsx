import AlgorithmCard from '@/components/AlgorithmCard';
import Link from 'next/link';

export default function Home() {
  const algorithms = [
    {
      title: 'Prime Number Check',
      description: 'Visualize the trial division algorithm to determine if a number is prime',
      category: 'math' as const,
      difficulty: 'easy' as const,
      route: '/prime',
      icon: '🔢',
      available: true,
    },
    {
      title: 'Bubble Sort',
      description: 'Watch elements bubble up to their correct positions step by step',
      category: 'sorting' as const,
      difficulty: 'easy' as const,
      route: '/bubble-sort',
      icon: '🫧',
      available: true,
    },
    {
      title: 'Quick Sort',
      description: 'See the divide-and-conquer approach in action with pivot selection',
      category: 'sorting' as const,
      difficulty: 'medium' as const,
      route: '/quick-sort',
      icon: '⚡',
      available: false,
    },
    {
      title: 'Binary Search',
      description: 'Efficiently find elements in sorted arrays by halving the search space',
      category: 'searching' as const,
      difficulty: 'easy' as const,
      route: '/binary-search',
      icon: '🔍',
      available: false,
    },
    {
      title: 'Breadth-First Search',
      description: 'Explore graph nodes level by level starting from the root',
      category: 'graph' as const,
      difficulty: 'medium' as const,
      route: '/bfs',
      icon: '🌊',
      available: false,
    },
    {
      title: 'Depth-First Search',
      description: 'Traverse graph by exploring as far as possible along each branch',
      category: 'graph' as const,
      difficulty: 'medium' as const,
      route: '/dfs',
      icon: '🏔️',
      available: false,
    },
    {
      title: 'Dijkstra\'s Algorithm',
      description: 'Find the shortest path between nodes in a weighted graph',
      category: 'graph' as const,
      difficulty: 'hard' as const,
      route: '/dijkstra',
      icon: '🛣️',
      available: false,
    },
    {
      title: 'Fibonacci Sequence',
      description: 'Visualize dynamic programming approach to calculate Fibonacci numbers',
      category: 'dp' as const,
      difficulty: 'easy' as const,
      route: '/fibonacci',
      icon: '🌀',
      available: false,
    },
    {
      title: 'Knapsack Problem',
      description: 'Optimize item selection to maximize value within weight constraints',
      category: 'dp' as const,
      difficulty: 'hard' as const,
      route: '/knapsack',
      icon: '🎒',
      available: false,
    },
    {
      title: 'Binary Tree Traversal',
      description: 'Explore in-order, pre-order, and post-order tree traversal methods',
      category: 'data-structures' as const,
      difficulty: 'medium' as const,
      route: '/tree-traversal',
      icon: '🌳',
      available: false,
    },
    {
      title: 'Stack Operations',
      description: 'Understand LIFO data structure with push, pop, and peek operations',
      category: 'data-structures' as const,
      difficulty: 'easy' as const,
      route: '/stack',
      icon: '📚',
      available: false,
    },
    {
      title: 'Queue Operations',
      description: 'Learn FIFO data structure with enqueue and dequeue operations',
      category: 'data-structures' as const,
      difficulty: 'easy' as const,
      route: '/queue',
      icon: '🎫',
      available: false,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 animate-flow-pulse"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent gradient-shift animate-fade-in-scale">
            Algorithm Visualizer
          </h1>
          <p className="text-3xl text-neutral-300 mb-4 font-light animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            Learn Data Structures & Algorithms Through Interactive Visualizations
          </p>
          <p className="text-xl text-neutral-500 mb-12 max-w-3xl mx-auto animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
            Watch algorithms come to life with step-by-step animations, smooth transitions, and engaging visual feedback
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 mb-16 animate-fade-in-scale" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="text-5xl font-black text-purple-400">{algorithms.length}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-cyan-400">6</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-pink-400">∞</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Learning</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 text-cyan-400 animate-bounce">
            <div className="text-sm font-medium">Explore Algorithms</div>
            <div className="w-8 h-12 border-2 border-cyan-500/50 rounded-full flex items-center justify-center">
              <div className="w-1 h-3 bg-cyan-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-12 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Choose Your Algorithm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {algorithms.map((algo, idx) => (
              <div
                key={algo.title}
                className="animate-fade-in-scale"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <AlgorithmCard {...algo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Algorithm Visualizer
          </div>
          <p className="text-neutral-500 mb-8">
            Built with Next.js 16.1.3, Spring Boot 4.0.1, and Java 25
          </p>
          <div className="flex justify-center gap-8 text-sm text-neutral-600">
            <span>© 2026 Algorithm Visualizer</span>
            <span>•</span>
            <span>Interactive Learning Platform</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
