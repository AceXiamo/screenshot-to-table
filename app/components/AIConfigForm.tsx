import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import type { AIConfig } from "~/types/ai";

interface AIConfigFormProps {
  config: AIConfig;
  onChange: (config: AIConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AIConfigForm({ config, onChange, isOpen, onToggle }: AIConfigFormProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onChange(localConfig);
    onToggle();
  };

  const handleReset = () => {
    setLocalConfig(config);
  };

  const presets = [
    {
      name: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1",
      model: "anthropic/claude-3.5-sonnet",
    },
    {
      name: "OpenAI",
      endpoint: "https://api.openai.com/v1",
      model: "gpt-4o",
    },
  ];

  return (
    <>
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 px-5 py-3 bg-white/70 backdrop-blur-sm text-slate-700 rounded-2xl hover:bg-white/90 transition-all duration-200 shadow-lg shadow-slate-200/50 border border-white/50 hover:scale-105"
      >
        <div className="p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
          <Icon icon="material-symbols:settings" className="w-5 h-5 text-slate-600" />
        </div>
        <span className="font-medium">AI 设置</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={onToggle}
            />
            
            {/* 弹窗内容 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.3
                }}
                className="w-[480px] max-w-full bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-slate-300/20 p-8"
              >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-light text-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI 配置
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggle}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                >
                  <Icon icon="material-symbols:close" className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    接口地址
                  </label>
                  <input
                    type="url"
                    value={localConfig.endpoint}
                    onChange={(e) => setLocalConfig({ ...localConfig, endpoint: e.target.value })}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    API 密钥
                  </label>
                  <input
                    type="password"
                    value={localConfig.apiKey}
                    onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                    placeholder="输入你的 API 密钥"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    模型名称
                  </label>
                  <input
                    type="text"
                    value={localConfig.model}
                    onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
                    placeholder="gpt-4o"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    快速预设
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {presets.map((preset, index) => (
                      <motion.button
                        key={preset.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLocalConfig({
                          ...localConfig,
                          endpoint: preset.endpoint,
                          model: preset.model,
                        })}
                        className="px-4 py-3 text-sm bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100 font-medium"
                      >
                        {preset.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3 pt-6 border-t border-slate-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    保存设置
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    重置
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}