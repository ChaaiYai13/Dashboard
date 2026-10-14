import React from 'react';
import { Task, TaskPriority } from '../types';
import { ShieldAlert, Shield, ShieldCheck } from 'lucide-react';

interface PriorityProgressCardProps {
  tasks: Task[];
}

export const PriorityProgressCard: React.FC<PriorityProgressCardProps> = ({ tasks }) => {
  const priorities: { name: TaskPriority; label: string; color: string; barColor: string }[] = [
    { name: 'สูง', label: 'ความสำคัญ: สูง', color: 'text-rose-600', barColor: 'bg-rose-500' },
    { name: 'ปานกลาง', label: 'ความสำคัญ: ปานกลาง', color: 'text-amber-600', barColor: 'bg-amber-500' },
    { name: 'ต่ำ', label: 'ความสำคัญ: ต่ำ', color: 'text-emerald-600', barColor: 'bg-emerald-500' },
  ];

  const stats = priorities.map((p) => {
    const pTasks = tasks.filter((t) => t.priority === p.name);
    const count = pTasks.length;
    const avgProgress =
      count > 0
        ? Math.round(pTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / count)
        : 0;
    const completedCount = pTasks.filter((t) => t.status === 'เสร็จสิ้น').length;

    return {
      ...p,
      count,
      avgProgress,
      completedCount,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          ความคืบหน้าตามระดับความสำคัญ
        </h3>
        <span className="text-xs text-slate-400 font-medium">3 ระดับ</span>
      </div>

      <div className="space-y-4 my-auto">
        {stats.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${item.color}`}>
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">
                  ({item.completedCount}/{item.count} งาน)
                </span>
                <span className="font-mono tabular-nums font-bold text-slate-800">
                  {item.avgProgress}%
                </span>
              </div>
            </div>
            {/* Progress Track */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                style={{ width: `${Math.min(100, Math.max(0, item.avgProgress))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
