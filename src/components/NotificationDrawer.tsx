import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { NotificationItem, Task } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotificationTask: (taskId: string) => void;
  onGoToSettings: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotificationTask,
  onGoToSettings,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'high' | 'overdue'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((item) => {
    if (filterType === 'unread') return !item.read;
    if (filterType === 'high') return item.priority === 'สูง';
    if (filterType === 'overdue') return item.type === 'overdue';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                ศูนย์การแจ้งเตือน
              </h3>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `มี ${unreadCount} รายการที่ยังไม่ได้อ่าน` : 'ไม่มีการแจ้งเตือนค้าง'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Actions Bar */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ยังไม่อ่าน ({unreadCount})
            </button>
            <button
              onClick={() => setFilterType('high')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'high'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ความสำคัญสูง
            </button>
            <button
              onClick={() => setFilterType('overdue')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'overdue'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              เกินกำหนด
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 whitespace-nowrap cursor-pointer shrink-0"
              title="อ่านทั้งหมด"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              อ่านทั้งหมด
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectNotificationTask(item.taskId);
                onClose();
              }}
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-start gap-3 ${
                !item.read ? 'bg-blue-50/40' : ''
              }`}
            >
              {/* Type Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'overdue'
                    ? 'bg-rose-100 text-rose-600'
                    : item.priority === 'สูง'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {item.type === 'overdue' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900 text-xs truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>

                <div className="flex items-center gap-2 mt-2 text-[10px]">
                  <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                    {item.taskId}
                  </span>
                  <span className="text-slate-500">{item.assignee}</span>
                  <span
                    className={`font-semibold ${
                      item.priority === 'สูง'
                        ? 'text-rose-600'
                        : item.priority === 'ปานกลาง'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    ความสำคัญ: {item.priority}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0 self-center" />
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400 px-4">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">ไม่มีรายการแจ้งเตือนตามเงื่อนไขที่เลือก</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onGoToSettings();
              onClose();
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            ปรับแต่งกฎการแจ้งเตือนตามระดับความสำคัญ &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
