import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  showBatchRetry?: boolean;
  onBatchRetry?: () => void;
  isBatchRetrying?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPath,
  showBatchRetry,
  onBatchRetry,
  isBatchRetrying,
}) => {
  const navItems = [
    { path: '/', label: '任务列表', icon: '📋' },
    { path: '/download', label: '新建下载', icon: '⬇️' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 left-0 right-0 backdrop-blur-2xl bg-white/10 border-b border-white/20 z-50 p-6"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-xl text-2xl"
              aria-label="关闭菜单"
            >
              ✕
            </button>

            {/* Navigation Items */}
            <nav className="flex flex-col gap-3 mt-12">
              {navItems.map((item, index) => {
                const isActive = currentPath === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <motion.div whileTap={{ scale: 0.95 }} className="flex items-center gap-3 w-full">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-white font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Batch Retry Button */}
              {showBatchRetry && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <button
                    onClick={() => {
                      onBatchRetry?.();
                      onClose();
                    }}
                    disabled={isBatchRetrying}
                    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
                      isBatchRetrying
                        ? 'bg-white/5 opacity-70 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg'
                    }`}
                  >
                    <motion.div
                      whileTap={!isBatchRetrying ? { scale: 0.95 } : {}}
                      className="flex items-center gap-3 w-full"
                    >
                      <motion.span
                        className="text-xl"
                        animate={isBatchRetrying ? { rotate: 360 } : {}}
                        transition={
                          isBatchRetrying
                            ? { duration: 1, repeat: Infinity, ease: 'linear' }
                            : {}
                        }
                      >
                        🔄
                      </motion.span>
                      <span className="text-white font-medium">
                        {isBatchRetrying ? '正在重试...' : '批量重试失败任务'}
                      </span>
                    </motion.div>
                  </button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
