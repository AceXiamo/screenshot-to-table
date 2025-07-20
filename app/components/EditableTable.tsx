import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import type { TableData } from "~/types/ai";

interface EditableTableProps {
  data: TableData;
  onChange: (data: TableData) => void;
  onExport: () => void;
}

export function EditableTable({ data, onChange, onExport }: EditableTableProps) {
  const [editingCell, setEditingCell] = useState<{row: number; col: number} | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...data.rows];
    if (!newRows[rowIndex]) {
      newRows[rowIndex] = [];
    }
    newRows[rowIndex][colIndex] = value;
    onChange({ ...data, rows: newRows });
    setEditingCell(null);
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...data.headers];
    newHeaders[index] = value;
    onChange({ ...data, headers: newHeaders });
    setEditingCell(null);
  };

  const addRow = (insertIndex?: number) => {
    const newRow = new Array(data.headers.length).fill("");
    const newRows = [...data.rows];
    if (insertIndex !== undefined) {
      newRows.splice(insertIndex + 1, 0, newRow);
    } else {
      newRows.push(newRow);
    }
    onChange({ ...data, rows: newRows });
  };

  const addColumn = (insertIndex?: number) => {
    const newHeaders = [...data.headers];
    const newRows = data.rows.map(row => [...row]);
    
    if (insertIndex !== undefined) {
      newHeaders.splice(insertIndex + 1, 0, "新列");
      newRows.forEach(row => row.splice(insertIndex + 1, 0, ""));
    } else {
      newHeaders.push("新列");
      newRows.forEach(row => row.push(""));
    }
    onChange({ headers: newHeaders, rows: newRows });
  };

  const deleteRow = (index: number) => {
    if (data.rows.length <= 1) return;
    const newRows = data.rows.filter((_, i) => i !== index);
    onChange({ ...data, rows: newRows });
  };

  const deleteColumn = (index: number) => {
    if (data.headers.length <= 1) return;
    const newHeaders = data.headers.filter((_, i) => i !== index);
    const newRows = data.rows.map(row => row.filter((_, i) => i !== index));
    onChange({ headers: newHeaders, rows: newRows });
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const newHeaders = [...data.headers];
    const newRows = data.rows.map(row => [...row]);
    
    const [movedHeader] = newHeaders.splice(fromIndex, 1);
    newHeaders.splice(toIndex, 0, movedHeader);
    
    newRows.forEach(row => {
      const [movedCell] = row.splice(fromIndex, 1);
      row.splice(toIndex, 0, movedCell);
    });
    
    onChange({ headers: newHeaders, rows: newRows });
  };

  const handleColumnDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColumn(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedColumn !== null && draggedColumn !== targetIndex) {
      moveColumn(draggedColumn, targetIndex);
    }
    setDraggedColumn(null);
  };

  if (!data.headers.length && !data.rows.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 text-slate-500"
      >
        <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-150 rounded-3xl inline-block mb-8">
          <Icon icon="material-symbols:table" className="w-20 h-20 text-slate-300" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-light text-slate-700">等待表格数据</h3>
          <p className="text-slate-500">上传截图后，AI 将自动识别并生成可编辑的表格</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6" ref={tableRef}>
      {/* 工具栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-light text-slate-800">表格数据</h3>
          <p className="text-slate-500 text-sm mt-1">
            点击单元格编辑 • 拖拽列标题重新排序 • 使用操作列管理行列
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addColumn()}
            className="px-4 py-2.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            <Icon icon="material-symbols:add" className="w-4 h-4" />
            <span>添加列</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addRow()}
            className="px-4 py-2.5 text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-emerald-500/25"
          >
            <Icon icon="material-symbols:add" className="w-4 h-4" />
            <span>添加行</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="px-4 py-2.5 text-sm bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-violet-500/25"
          >
            <Icon icon="material-symbols:download" className="w-4 h-4" />
            <span>导出 Excel</span>
          </motion.button>
        </div>
      </div>

      {/* 表格容器 */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 bg-white/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-blue-50/50">
                {/* 行号列 */}
                <th className="sticky left-0 z-20 w-12 py-3 text-center border-r border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50/50">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-slate-300 to-slate-400 mx-auto opacity-0"></div>
                </th>
                
                {/* 数据列 */}
                {data.headers.map((header, index) => (
                  <th 
                    key={index} 
                    className={`relative group border-r border-slate-200/50 transition-all duration-200 min-w-[200px] ${
                      draggedColumn === index ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleColumnDragStart(e, index)}
                    onDragOver={handleColumnDragOver}
                    onDrop={(e) => handleColumnDrop(e, index)}
                  >
                    {editingCell?.row === -1 && editingCell?.col === index ? (
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => updateHeader(index, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingCell(null);
                          if (e.key === "Escape") setEditingCell(null);
                        }}
                        className="w-full p-3 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium text-slate-700 rounded"
                        autoFocus
                      />
                    ) : (
                      <div className="p-3 cursor-move hover:bg-blue-50/50 transition-all duration-200 min-h-[48px] flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* 拖拽指示器 */}
                          <Icon icon="material-symbols:drag-indicator" className="w-4 h-4 text-slate-400" />
                          <span 
                            className="text-sm font-medium text-slate-700 select-none cursor-pointer"
                            onClick={() => setEditingCell({ row: -1, col: index })}
                          >
                            {header || `列 ${index + 1}`}
                          </span>
                        </div>
                        
                        {/* 列操作按钮 */}
                        <div className="flex items-center space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addColumn(index);
                            }}
                            className="p-1 rounded text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                            title="在右侧插入列"
                          >
                            <Icon icon="material-symbols:add" className="w-3 h-3" />
                          </motion.button>
                          
                          {data.headers.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteColumn(index);
                              }}
                              className="p-1 rounded text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                              title="删除此列"
                            >
                              <Icon icon="material-symbols:close" className="w-3 h-3" />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
                
                {/* 固定操作列 */}
                <th className="sticky right-0 z-20 w-32 py-3 text-center bg-gradient-to-l from-slate-50 to-blue-50/50 border-l border-slate-200">
                  <span className="text-sm font-medium text-slate-600">操作</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIndex) => (
                <motion.tr 
                  key={rowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.02 }}
                  className={`border-t border-slate-100 group transition-all duration-200 ${
                    hoveredRow === rowIndex ? 'bg-gradient-to-r from-slate-50/50 to-blue-50/30' : 'hover:bg-slate-50/30'
                  }`}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* 行号列 */}
                  <td className="sticky left-0 z-10 w-12 text-center text-slate-400 py-3 border-r border-slate-200/50 bg-white/80 backdrop-blur-sm">
                    <span className="text-xs font-medium select-none">{rowIndex + 1}</span>
                  </td>
                  
                  {/* 数据列 */}
                  {data.headers.map((_, colIndex) => (
                    <td key={colIndex} className="border-r border-slate-100 min-w-[200px]">
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                        <input
                          type="text"
                          value={row[colIndex] || ""}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setEditingCell(null);
                            if (e.key === "Escape") setEditingCell(null);
                          }}
                          className="w-full p-3 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-700 rounded"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="p-3 cursor-pointer hover:bg-blue-50/40 transition-all duration-200 min-h-[48px] flex items-center text-sm text-slate-700"
                          onClick={() => setEditingCell({ row: rowIndex, col: colIndex })}
                        >
                          {row[colIndex] || (
                            <span className="text-slate-400 italic text-xs">点击编辑</span>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  
                  {/* 固定操作列 */}
                  <td className="sticky right-0 z-10 w-32 py-2 px-3 bg-white/80 backdrop-blur-sm border-l border-slate-200">
                    <div className="flex items-center justify-center space-x-1">
                      {/* 在此行下方插入新行 */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addRow(rowIndex)}
                        className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                        title="在下方插入行"
                      >
                        <Icon icon="material-symbols:add" className="w-4 h-4" />
                      </motion.button>
                      
                      {/* 删除此行 */}
                      {data.rows.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteRow(rowIndex)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          title="删除此行"
                        >
                          <Icon icon="material-symbols:delete" className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
