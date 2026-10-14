import React from 'react';
import { ClipboardList, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface KpiCardsProps {
  tasks: Task[];
  onFilterStatus?: (status: TaskStatus | 'all') => void;
  selectedStatus?: TaskStatus | 'all';
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  tasks,
  onFilterStatus,
  selectedStatus = 'all',
}) => {
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === 'กำลังดำเนินการ' || t.status === 'รอดำเนินการ').length;
  const completed = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const overdue = tasks.filter((t) => t.status === 'เกินกำหนด').length;

  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 tracking-tight">
        ภาพรวมสถานะงาน
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Tasks Card */}
        <button
          onClick={() => onFilterStatus?.('all')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
            selectedStatus === 'all'
              ? 'ring-2 ring-blue-500 bg-sky-50/90 border-blue-200 shadow-xs'
              : 'bg-sky-50/50 hover:bg-sky-50/80 border-sky-100 hover:border-sky-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700">งานทั้งหมด</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-blue-900 font-mono tabular-nums">
            {total}
          </div>
        </button>

        {/* In Progress Card */}
        <button
          onClick={() => onFilterStatus?.('กำลังดำเนินการ')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
            selectedStatus === 'กำลังดำเนินการ'
              ? 'ring-2 ring-blue-500 bg-blue-50/90 border-blue-200 shadow-xs'
              : 'bg-blue-50/50 hover:bg-blue-50/80 border-blue-100 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Loader2 className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <span className="text-sm font-medium text-slate-700">กำลังดำเนินการ</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-blue-700 font-mono tabular-nums">
            {inProgress}
          </div>
        </button>

        {/* Completed Card */}
        <button
          onClick={() => onFilterStatus?.('เสร็จสิ้น')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
            selectedStatus === 'เสร็จสิ้น'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/90 border-emerald-200 shadow-xs'
              : 'bg-emerald-50/50 hover:bg-emerald-50/80 border-emerald-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700">เสร็จสิ้น</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {completed}
          </div>
        </button>

        {/* Overdue Card */}
        <button
          onClick={() => onFilterStatus?.('เกินกำหนด')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
            selectedStatus === 'เกินกำหนด'
              ? 'ring-2 ring-rose-500 bg-rose-50/90 border-rose-200 shadow-xs'
              : 'bg-rose-50/50 hover:bg-rose-50/80 border-rose-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700">เกินกำหนด</span>
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-rose-700 font-mono tabular-nums">
            {overdue}
          </div>
        </button>
      </div>
    </div>
  );
};
