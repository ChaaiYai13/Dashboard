import React from 'react';
import { Task } from '../types';

interface StatusDonutChartProps {
  tasks: Task[];
  onSelectStatus?: (status: string) => void;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  tasks,
  onSelectStatus,
}) => {
  const total = tasks.length;

  const completed = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const inProgress = tasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const pending = tasks.filter((t) => t.status === 'รอดำเนินการ' || t.status === 'ยังไม่เริ่ม').length;
  const overdue = tasks.filter((t) => t.status === 'เกินกำหนด').length;
  const cancelled = tasks.filter((t) => t.status === 'ยกเลิก').length;

  const items = [
    { label: 'เสร็จสิ้น', count: completed, color: '#16A34A', percentage: total > 0 ? Math.round((completed / total) * 100) : 59 },
    { label: 'กำลังดำเนินการ', count: inProgress, color: '#2563EB', percentage: total > 0 ? Math.round((inProgress / total) * 100) : 33 },
    { label: 'รอดำเนินการ', count: pending, color: '#F59E0B', percentage: total > 0 ? Math.round((pending / total) * 100) : 4 },
    { label: 'เกินกำหนด', count: overdue, color: '#EF4444', percentage: total > 0 ? Math.round((overdue / total) * 100) : 8 },
    { label: 'ยกเลิก', count: cancelled, color: '#94A3B8', percentage: 0 },
  ];

  // SVG Donut calculation
  const radius = 54;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
        สถานะงาน
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Donut Chart SVG */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            {/* Background Circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {items.map((item, index) => {
              if (item.count === 0 && total > 0) return null;
              const percent = total > 0 ? item.count / total : item.percentage / 100;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={index}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-85 cursor-pointer"
                  onClick={() => onSelectStatus?.(item.label)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-slate-900 leading-none">
              {total}
            </span>
            <span className="text-xs text-slate-500 font-medium mt-1">งาน</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full sm:w-auto flex-1 space-y-2 text-xs">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectStatus?.(item.label)}
              className="w-full flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 font-medium group-hover:text-slate-900">
                  {item.label}
                </span>
              </div>
              <div className="font-mono tabular-nums text-slate-600 font-medium">
                {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
