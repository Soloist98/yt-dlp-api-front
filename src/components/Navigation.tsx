import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileMenu from './MobileMenu';

interface NavigationProps {
  showBatchRetry?: boolean;
  onBatchRetry?: () => void;
  isBatchRetrying?: boolean;
}

/**
 * Navigation component with Liquid Design
 * Top horizontal navigation bar with glassmorphism
 */
export const Navigation: React.FC<NavigationProps> = ({
  showBatchRetry,
  onBatchRetry,
  isBatchRetrying,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '任务列表', icon: '📋' },
    { path: '/download', label: '新建下载', icon: '⬇️' },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 h-16 md:h-20 px-6 md:px-12 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg z-50"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Mobile Elements */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-xl text-2xl"
              aria-label="菜单"
              aria-expanded={isMenuOpen}
            >
              ☰
            </button>
          </div>

          <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            <h1 className="text-white font-semibold text-lg">视频下载</h1>
          </div>

          <div className="md:hidden w-10" />

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`
                      relative px-6 py-3 rounded-xl font-medium text-base flex items-center gap-2
                      ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80 hover:bg-white/10'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                        layoutId="activeTab"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 text-xl">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Desktop Batch Retry Button */}
          {showBatchRetry && (
            <motion.button
              onClick={onBatchRetry}
              disabled={isBatchRetrying}
              className={`
                hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                ${
                  isBatchRetrying
                    ? 'bg-white/5 opacity-70 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 hover:scale-105'
                }
              `}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={!isBatchRetrying ? { scale: 0.95 } : {}}
            >
              <motion.span
                className="text-lg"
                animate={isBatchRetrying ? { rotate: 360 } : {}}
                transition={
                  isBatchRetrying
                    ? { duration: 1, repeat: Infinity, ease: 'linear' }
                    : {}
                }
              >
                🔄
              </motion.span>
              <span>{isBatchRetrying ? '正在重试...' : '批量重试'}</span>
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentPath={location.pathname}
        showBatchRetry={showBatchRetry}
        onBatchRetry={onBatchRetry}
        isBatchRetrying={isBatchRetrying}
      />
    </>
  );
};
