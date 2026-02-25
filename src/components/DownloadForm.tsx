import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface DownloadFormProps {
  onSubmit: (url: string) => void;
  isSubmitting: boolean;
}

/**
 * Download form component with liquid design
 */
export const DownloadForm: React.FC<DownloadFormProps> = ({ onSubmit, isSubmitting }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-gradient">添加下载任务</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="输入视频链接..."
              className={cn(
                'w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10',
                'text-white placeholder-white/40 outline-none transition-all duration-300',
                'focus:bg-white/10 focus:border-white/30'
              )}
              required
            />
            {isFocused && (
              <motion.n                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
            开始下载
          </Button>
        </form>
      </div>
    </GlassCard>
  );
};
