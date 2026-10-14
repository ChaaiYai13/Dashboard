import React from 'react';
import { AlertTriangle, ChevronRight, Mail } from 'lucide-react';
import { Task } from '../types';

interface TopOverdueCardProps {
  tasks: Task[];
  onViewAllOverdue: () => void;
  onSelectTask?: (task: Task) => void;
  onOpenSendEmailModal?: (task: Task) => void;
}

export const TopOverdueCard: React.FC<TopOverdueCardProps> = ({
  tasks,
  onViewAllOverdue,
  onSelectTask,
  onOpenSendEmailModal,
}) => {
  // Filter overdue tasks and sort by overdue days descending
  const overdueTasks = tasks
    .filter((t) => t.status === 'เกินกำหนด')
    .sort((a, b) => (b.overdueDays || 0) - (a.overdueDays || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            งานที่เกินกำหนด
          </h3>
        </div>
        <button
          onClick={onViewAllOverdue}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          ดูทั้งหมด
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto flex-1 flex flex-col justify-center">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-medium">
              <th className="pb-2 font-normal">เลขที่หนังสือ</th>
              <th className="pb-2 font-normal">รายการ</th>
              <th className="pb-2 font-normal">กำหนดส่ง</th>
              <th className="pb-2 font-normal text-right">วันเกินกำหนด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {overdueTasks.map((task) => (
              <tr
                key={task.id}
                onClick={() => onSelectTask?.(task)}
                className="hover:bg-rose-50/40 cursor-pointer transition-colors group"
              >
                <td className="py-2.5 font-mono font-medium text-slate-700 group-hover:text-blue-600">
                  {task.id}
                </td>
                <td className="py-2.5 font-medium text-slate-800 max-w-[120px] truncate" title={task.title}>
                  {task.title}
                </td>
                <td className="py-2.5 text-slate-500 whitespace-nowrap">
                  {task.dueDate}
                </td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-mono font-semibold text-rose-600">
                      {task.overdueDays || 1} วัน
                    </span>
                    {onOpenSendEmailModal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSendEmailModal(task);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-colors"
                        title="ส่งอีเมลเตือนงานนี้"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {overdueTasks.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                  ไม่พบงานที่เกินกำหนด
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
