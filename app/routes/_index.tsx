import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { ImageUploader } from "~/components/ImageUploader";
import { EditableTable } from "~/components/EditableTable";
import { AIConfigForm } from "~/components/AIConfigForm";
import { createAIClient } from "~/utils/ai-client";
import { exportToExcel, exportToCSV } from "~/utils/excel-export";
import type { AIConfig, TableData } from "~/types/ai";
import { Icon } from "@iconify/react";

export const meta: MetaFunction = () => {
  return [
    { title: "截图转表格 - AI 智能识别" },
    { name: "description", content: "使用 AI 将截图智能转换为可编辑表格" },
  ];
};

export default function Index() {
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    endpoint: "https://openrouter.ai/api/v1",
    apiKey: "",
    model: "anthropic/claude-3.5-sonnet",
  });
  const [configOpen, setConfigOpen] = useState(false);
  const [tableData, setTableData] = useState<TableData>({ headers: [], rows: [] });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (base64: string) => {
    if (!aiConfig.apiKey) {
      setError("请先配置 AI 设置");
      setConfigOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const client = createAIClient(aiConfig);
      const data = await client.analyzeImage(base64);
      setTableData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "图片分析失败");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    try {
      exportToExcel(tableData, "截图表格数据");
    } catch (err) {
      setError(err instanceof Error ? err.message : "导出数据失败");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 头部区域 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-light text-slate-800 flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                  <Icon icon="material-symbols:screenshot-monitor" className="w-8 h-8 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  截图转表格
                </span>
              </h1>
              <p className="text-slate-600 text-lg font-light ml-16">
                智能识别截图中的表格数据，一键转换为可编辑表格
              </p>
            </div>
            <AIConfigForm
              config={aiConfig}
              onChange={setAiConfig}
              isOpen={configOpen}
              onToggle={() => setConfigOpen(!configOpen)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12 space-y-8">
        {/* 错误提示 */}
        {error && (
          <div className="bg-white/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-5 shadow-lg shadow-red-500/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Icon icon="material-symbols:error" className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-red-700 font-medium flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors duration-200"
              >
                <Icon icon="material-symbols:close" className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        )}

        {/* 图片上传区域 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-light text-slate-800 mb-2">上传截图</h2>
            <p className="text-slate-500">支持拖拽上传或点击选择图片文件</p>
          </div>
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isAnalyzing} />
        </div>

        {/* 表格编辑区域 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/50">
          <EditableTable
            data={tableData}
            onChange={setTableData}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}
