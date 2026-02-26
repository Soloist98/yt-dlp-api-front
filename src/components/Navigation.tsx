import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Navigation component with Liquid Design
 * Vertical sidebar navigation with glassmorphism
 */
export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '任务列表', icon: '📋' },
    { path: '/download', label: '新建下载', icon: '⬇️' },
  ];

  return (
    <motion.nav
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col gap-3 p-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`
                  relative px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300
                  ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80'}
                `}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, x: 5 }}
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
                <span className="relative z-10 flex flex-col items-center gap-1 min-w-[60px]">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs whitespace-nowrap">{item.label}</span>
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
