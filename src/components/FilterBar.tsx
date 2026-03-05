import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskStatus } from '../types/task';
import { cn } from '../utils/cn';

interface FilterBarProps {
  onFilterChange: (status?: TaskStatus, search?: string) => void;
  onActiveFilterChange?: (filter: TaskStatus | 'all') => void;
}

/**
 * Filter bar component for task filtering
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  onActiveFilterChange
}) => {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: Array<{ value: TaskStatus | 'all'; label: string; icon: string }> = [
    { value: 'all', label: '全部', icon: '📋' },
    { value: 'pending', label: '下载中', icon: '⏳' },
    { value: 'completed', label: '已完成', icon: '✓' },
    { value: 'failed', label: '失败', icon: '✕' },
  ];

  const handleFilterClick = (filter: TaskStatus | 'all') => {
    setActiveFilter(filter);
    onFilterChange(filter === 'all' ? undefined : filter, searchQuery || undefined);
    onActiveFilterChange?.(filter);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFilterChange(activeFilter === 'all' ? undefined : activeFilter, value || undefined);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="搜索任务..."
          className={cn(
            'w-full px-6 py-4 pl-12 rounded-2xl glass',
            'text-white placeholder-white/40 outline-none transition-all duration-300',
            'focus:bg-white/10 focus:border-white/30'
          )}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={cn(
              'px-6 py-3 rounded-2xl font-medium transition-all duration-300',
              'flex items-center gap-2 hover:scale-105 active:scale-95',
              activeFilter === filter.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'glass hover:bg-white/10 text-white/80'
            )}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
