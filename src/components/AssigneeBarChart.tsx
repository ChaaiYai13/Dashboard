import React from 'react';
import { Task } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';

interface AssigneeBarChartProps {
  tasks: Task[];
  onSelectAssignee?: (name: string) => void;
}

export const AssigneeBarChart: React.FC<AssigneeBarChartProps> = ({
  tasks,
  onSelectAssignee,
}) => {
  const data = TEAM_MEMBERS.map((person) => {
    const userTasks = tasks.filter((t) => t.assignee === person.name);
    return {
      ...person,
      count: userTasks.length > 0 ? userTasks.length : (person.activeCount || 0),
    };
  });

  const maxCount = Math.max(...data.map((d) => d.count), 15);
  const maxVal = Math.ceil(maxCount / 5) * 5;
  const midVal = Math.round(maxVal / 2);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            งานแยกตามผู้รับผิดชอบ
          </h3>
          <p className="text-[11px] text-slate-400">ภาระงานของผู้รับผิดชอบหลักทั้ง 12 ท่าน</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
          {TEAM_MEMBERS.length} ท่าน
        </span>
      </div>

      <div className="relative pt-4 pb-1 flex-1 flex flex-col justify-end">
        {/* Y-axis ticks line & labels */}
        <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-5 text-right">{maxVal}</span>
            <div className="flex-1 border-b border-dashed border-slate-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 text-right">{midVal}</span>
            <div className="flex-1 border-b border-dashed border-slate-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 text-right">0</span>
            <div className="flex-1 border-b border-slate-200" />
          </div>
        </div>

        {/* Bars Container - horizontally scrollable for 12 members with clean touch/mouse drag */}
        <div className="ml-7 flex gap-2 items-end h-40 pt-4 z-10 overflow-x-auto pb-1 scrollbar-thin">
          {data.map((item, idx) => {
            const heightPercent = Math.min(100, (item.count / maxVal) * 100);
            return (
              <div
                key={idx}
                onClick={() => onSelectAssignee?.(item.name)}
                className="flex flex-col items-center justify-end h-full group cursor-pointer min-w-[46px] flex-1"
                title={`${item.name}: ${item.count} รายการ`}
              >
                {/* Count number label above bar */}
                <span className="text-xs font-mono font-semibold text-slate-700 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.count}
                </span>

                {/* Vertical Bar */}
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-md overflow-hidden flex items-end h-full">
                  <div
                    className="w-full rounded-t-md transition-all duration-500 group-hover:brightness-95"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Assignee Name below bar */}
                <span className="text-[10px] font-medium text-slate-600 mt-1.5 truncate max-w-[48px] text-center group-hover:text-blue-600 transition-colors">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
