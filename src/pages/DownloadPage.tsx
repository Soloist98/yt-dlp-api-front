import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DownloadForm } from '../components/DownloadForm';
import { useTasks } from '../hooks/useTasks';

/**
 * Download page - dedicated page for submitting new download tasks
 */
export const DownloadPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitDownload, isSubmitting } = useTasks();

  const handleSubmitDownload = (url: string) => {
    submitDownload({ url }, {
      onSuccess: () => {
        // Navigate to home page after successful submission
        setTimeout(() => {
          navigate('/');
        }, 1000);
      },
    });
  };

  return (
    <div className="min-h-screen p-6 md:p-12 md:pl-32">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 text-gradient"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            新建下载任务
          </motion.h1>
          <p className="text-xl text-white/60">
            输入视频链接，开始下载
          </p>
        </motion.div>

        {/* Download Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <DownloadForm onSubmit={handleSubmitDownload} isSubmitting={isSubmitting} />
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="mt-12 p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>使用提示</span>
          </h3>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>支持主流视频网站（YouTube、Bilibili、Twitter 等）</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">•</span>
              <span>自动选择最佳画质和音质</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-400 mt-1">•</span>
              <span>下载完成后可在任务列表查看</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">•</span>
              <span>失败的任务支持一键重试</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="fixed top-40 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="fixed bottom-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 30, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
