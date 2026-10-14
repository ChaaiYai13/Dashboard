import React, { useState } from 'react';
import { FileSpreadsheet, ExternalLink, Download, Copy, Check, Link as LinkIcon } from 'lucide-react';
import { Task } from '../types';

interface SheetGridViewProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  onOpenAppsScript: () => void;
}

export const SheetGridView: React.FC<SheetGridViewProps> = ({
  tasks,
  onSelectTask,
  onOpenAppsScript,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dashboard' | 'reports'>('all');

  // Take first 6 tasks for the embedded sheet preview matching the screenshot
  const displayTasks = tasks.slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 sm:px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-xs bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            มุมมองใน Google Sheet
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAppsScript}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            title="ดูโค้ด Apps Script เชื่อมโยงชีต"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">เชื่อมโยงชีต</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-x-auto text-[11px] font-sans">
        <table className="w-full border-collapse">
          {/* Column Letters Bar */}
          <thead>
            <tr className="bg-slate-100/90 text-slate-500 border-b border-slate-200 font-mono text-center select-none text-[10px]">
              <th className="w-8 border-r border-slate-200 py-1 bg-slate-200/50">#</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">A</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">B</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">C</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">D</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">E</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">F</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">G</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">H</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">I</th>
              <th className="border-r border-slate-200 py-1 px-2 font-normal">J</th>
              <th className="py-1 px-2 font-normal">K</th>
            </tr>
            {/* Header Names Row */}
            <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 whitespace-nowrap text-[11px]">
              <td className="w-8 text-center bg-slate-100 text-slate-400 font-mono border-r border-slate-200 py-1.5 text-[10px]">
                1
              </td>
              <td className="border-r border-slate-200 py-1.5 px-2">เลขที่หนังสือ</td>
              <td className="border-r border-slate-200 py-1.5 px-2">รายการ</td>
              <td className="border-r border-slate-200 py-1.5 px-2">ผู้รับผิดชอบหลัก</td>
              <td className="border-r border-slate-200 py-1.5 px-2">ผู้รับผิดชอบแทน</td>
              <td className="border-r border-slate-200 py-1.5 px-2">วันที่รับ / มอบหมาย</td>
              <td className="border-r border-slate-200 py-1.5 px-2">กำหนดส่ง</td>
              <td className="border-r border-slate-200 py-1.5 px-2 text-center">สถานะ</td>
              <td className="border-r border-slate-200 py-1.5 px-2 text-center">% ความคืบหน้า</td>
              <td className="border-r border-slate-200 py-1.5 px-2">ขั้นตอนถัดไป</td>
              <td className="border-r border-slate-200 py-1.5 px-2">ปัญหา/ต้องการช่วย</td>
              <td className="py-1.5 px-2 text-center">อัปเดตล่าสุด</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {displayTasks.map((task, idx) => (
              <tr
                key={task.id}
                onClick={() => onSelectTask?.(task)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors"
              >
                {/* Row Number */}
                <td className="w-8 text-center bg-slate-50 text-slate-400 font-mono border-r border-slate-200 py-1.5 text-[10px]">
                  {idx + 2}
                </td>
                {/* เลขที่หนังสือ */}
                <td className="border-r border-slate-200 py-1.5 px-2 font-mono font-medium text-slate-800 whitespace-nowrap">
                  {task.id}
                </td>
                {/* รายการ */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-800 truncate max-w-[120px]" title={task.title}>
                  {task.title}
                </td>
                {/* ผู้รับผิดชอบหลัก */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-700 whitespace-nowrap">
                  {task.assignee}
                </td>
                {/* ผู้รับผิดชอบแทน */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-500 whitespace-nowrap">
                  {task.backupAssignee || '-'}
                </td>
                {/* วันที่รับ / มอบหมาย */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-500 whitespace-nowrap font-mono text-[10px]">
                  {task.startDate}
                </td>
                {/* กำหนดส่ง */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-500 whitespace-nowrap font-mono text-[10px]">
                  {task.dueDate}
                </td>
                {/* สถานะ */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${
                      task.status === 'เสร็จสิ้น'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'เกินกำหนด'
                        ? 'bg-rose-100 text-rose-800'
                        : task.status === 'กำลังดำเนินการ'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                {/* % ความคืบหน้า */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-center whitespace-nowrap">
                  <div className="flex items-center gap-1 justify-center">
                    <div className="w-10 bg-slate-200 rounded-xs h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          task.status === 'เสร็จสิ้น' ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] tabular-nums text-slate-600">
                      {task.progress}%
                    </span>
                  </div>
                </td>
                {/* ขั้นตอนถัดไป */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-600 truncate max-w-[110px]" title={task.nextSteps || '-'}>
                  {task.nextSteps || '-'}
                </td>
                {/* ปัญหา */}
                <td className="border-r border-slate-200 py-1.5 px-2 text-slate-500 truncate max-w-[110px]" title={task.issues || '-'}>
                  {task.issues || '-'}
                </td>
                {/* อัปเดตล่าสุด */}
                <td className="py-1.5 px-2 text-center whitespace-nowrap font-mono text-[10px] text-slate-400">
                  {task.updatedAt || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Bottom Tabs */}
      <div className="bg-slate-100 border-t border-slate-200 px-3 py-1.5 flex items-center gap-1 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-t-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          งานทั้งหมด
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 rounded-t-sm font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-1 rounded-t-sm font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          รายงาน
        </button>
      </div>
    </div>
  );
};
