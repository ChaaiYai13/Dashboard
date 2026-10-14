import React from 'react';
import { ClipboardList, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Task, TaskStatus } from '../types/task';

interface MetricCardsProps {
  tasks: Task[];
  selectedFilter: TaskStatus | 'ทั้งหมด';
  onSelectFilter: (status: TaskStatus | 'ทั้งหมด') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  tasks,
  selectedFilter,
  onSelectFilter,
}) => {
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const completed = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const overdue = tasks.filter((t) => t.status === 'เกินกำหนด').length;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-3 tracking-tight">
        ภาพรวมสถานะงาน
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: งานทั้งหมด */}
        <div
          onClick={() => onSelectFilter('ทั้งหมด')}
          className={`cursor-pointer rounded-2xl p-4 transition-all duration-150 border ${
            selectedFilter === 'ทั้งหมด'
              ? 'ring-2 ring-blue-500 bg-blue-50/70 border-blue-200 shadow-sm'
              : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">งานทั้งหมด</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1976d2] font-mono tabular-nums leading-tight">
                {total}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: กำลังดำเนินการ */}
        <div
          onClick={() => onSelectFilter('กำลังดำเนินการ')}
          className={`cursor-pointer rounded-2xl p-4 transition-all duration-150 border ${
            selectedFilter === 'กำลังดำเนินการ'
              ? 'ring-2 ring-blue-500 bg-blue-50/70 border-blue-200 shadow-sm'
              : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0288d1] text-white flex items-center justify-center shadow-xs shrink-0">
              <Loader2 className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">กำลังดำเนินการ</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0288d1] font-mono tabular-nums leading-tight">
                {inProgress}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: เสร็จสิ้น */}
        <div
          onClick={() => onSelectFilter('เสร็จสิ้น')}
          className={`cursor-pointer rounded-2xl p-4 transition-all duration-150 border ${
            selectedFilter === 'เสร็จสิ้น'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/70 border-emerald-200 shadow-sm'
              : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2e7d32] text-white flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">เสร็จสิ้น</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#2e7d32] font-mono tabular-nums leading-tight">
                {completed}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: เกินกำหนด */}
        <div
          onClick={() => onSelectFilter('เกินกำหนด')}
          className={`cursor-pointer rounded-2xl p-4 transition-all duration-150 border ${
            selectedFilter === 'เกินกำหนด'
              ? 'ring-2 ring-rose-500 bg-rose-50/70 border-rose-200 shadow-sm'
              : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#d32f2f] text-white flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">เกินกำหนด</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#d32f2f] font-mono tabular-nums leading-tight">
                {overdue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
