import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, ArrowRight, Code2, Sparkles, Mail, SlidersHorizontal, Volume2, SendHorizontal } from 'lucide-react';
import { Task, PriorityNotificationRule } from '../types';
import { playNotificationChime } from '../utils/notificationAudio';

interface NotificationPreviewProps {
  onOpenAppsScript: () => void;
  selectedTask?: Task | null;
  onGoToNotificationHub?: () => void;
  onOpenSendEmailModal?: (task: Task) => void;
  rules?: Record<string, PriorityNotificationRule>;
}

export const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  onOpenAppsScript,
  selectedTask,
  onGoToNotificationHub,
  onOpenSendEmailModal,
  rules,
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Active task for preview
  const taskToDisplay: Task = selectedTask || {
    id: 'อว 0601/ว 001',
    title: 'พัฒนาระบบติดตาม',
    project: 'โครงการพัฒนาระบบติดตาม',
    assignee: 'จันทิมา',
    assigneeEmail: 'chanthima@gistda.or.th',
    backupAssignee: 'ศิริวัฒน์',
    backupAssigneeEmail: 'siriwat@gistda.or.th',
    startDate: '8 ต.ค. 69',
    dueDate: '15 ต.ค. 2569',
    status: 'กำลังดำเนินการ',
    progress: 60,
    priority: 'สูง',
  };

  const priorityRule = rules?.[taskToDisplay.priority];
  const daysBefore = priorityRule?.daysBeforeDue?.[1] || 3;

  const handleTestSend = () => {
    setIsSending(true);
    playNotificationChime(taskToDisplay.priority);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 sm:px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            ตัวอย่างการแจ้งเตือนอัตโนมัติ (Email)
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              taskToDisplay.priority === 'สูง'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : taskToDisplay.priority === 'ปานกลาง'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            ระดับ: {taskToDisplay.priority}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Email Simulation Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-3 relative overflow-hidden">
          {/* Top Email Meta */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {taskToDisplay.priority === 'สูง'
                  ? `[ด่วนที่สุด] งานความสำคัญสูงใกล้ครบกำหนด: ${taskToDisplay.title}`
                  : `แจ้งเตือนงานใกล้ครบกำหนดส่ง: ${taskToDisplay.title}`}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                <span className="truncate">task-tracker@gistda.or.th</span>
                <span className="shrink-0 text-slate-400 font-mono text-[10px]">เมื่อวานนี้ 09:00 น.</span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="pt-2 border-t border-slate-200/60 text-xs space-y-2 text-slate-700">
            <p className="font-medium text-slate-800">
              เรียน คุณ{taskToDisplay.assignee}
            </p>
            <div className="flex items-center gap-2">
              <p
                className={`text-[11px] font-semibold px-2 py-1 rounded border inline-block ${
                  taskToDisplay.status === 'เกินกำหนด'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {taskToDisplay.status === 'เกินกำหนด'
                  ? `งานนี้เกินกำหนดส่งมาแล้ว ${taskToDisplay.overdueDays || 1} วัน`
                  : `มีงานที่ใกล้ครบกำหนดในอีก ${daysBefore} วัน`}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 space-y-1 text-[11px] font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">เลขที่หนังสือ:</span>
                <span className="font-mono font-semibold text-slate-800">{taskToDisplay.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">รายการ:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">
                  {taskToDisplay.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ผู้รับผิดชอบหลัก:</span>
                <span className="text-slate-700">{taskToDisplay.assignee}</span>
              </div>
              {taskToDisplay.backupAssignee && (
                <div className="flex justify-between">
                  <span className="text-slate-500">ผู้รับผิดชอบแทน:</span>
                  <span className="text-slate-600">{taskToDisplay.backupAssignee}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">กำหนดส่ง:</span>
                <span className="font-semibold text-rose-600">{taskToDisplay.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ความสำคัญ:</span>
                <span className={`font-semibold ${
                  taskToDisplay.priority === 'สูง'
                    ? 'text-rose-600'
                    : taskToDisplay.priority === 'ปานกลาง'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}>
                  {taskToDisplay.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ความคืบหน้า:</span>
                <span className="font-mono font-semibold text-blue-600">{taskToDisplay.progress}%</span>
              </div>
              {taskToDisplay.nextSteps && (
                <div className="flex justify-between border-t border-slate-100 pt-1 text-[10px]">
                  <span className="text-slate-500">ขั้นตอนถัดไป:</span>
                  <span className="text-blue-700 text-right truncate max-w-[150px] font-medium">{taskToDisplay.nextSteps}</span>
                </div>
              )}
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenSendEmailModal?.(taskToDisplay)}
                className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                ดูรายละเอียดและส่งเมล์ <ArrowRight className="w-3 h-3" />
              </button>
              {onGoToNotificationHub && (
                <button
                  type="button"
                  onClick={onGoToNotificationHub}
                  className="text-slate-500 hover:text-blue-600 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  ตั้งค่ากฎ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {sentSuccess && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ส่งอีเมลแจ้งเตือนไปยัง {taskToDisplay.assignee} เรียบร้อยแล้ว!</span>
            </div>
          )}

          {/* Primary Action Button: Open Email Modal */}
          <button
            type="button"
            onClick={() => onOpenSendEmailModal?.(taskToDisplay)}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <SendHorizontal className="w-4 h-4" />
            เปิด Popup ส่งอีเมลงานนี้
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTestSend}
              disabled={isSending}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              {isSending ? 'กำลังจำลองส่ง...' : 'ทดสอบส่งด่วน'}
            </button>
            <button
              onClick={onOpenAppsScript}
              className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              โค้ด Apps Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
