import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  FileText,
  ListChecks,
  AlertCircle,
  Link as LinkIcon,
  UserCheck
} from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { playNotificationChime } from '../utils/notificationAudio';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEmailSent?: (details: {
    taskId: string;
    taskTitle: string;
    recipient: string;
    subject: string;
    priority: TaskPriority;
  }) => void;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEmailSent,
}) => {
  const [recipient, setRecipient] = useState('');
  const [ccEmail, setCcEmail] = useState('singha@gistda.or.th');
  const [subject, setSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (task) {
      setRecipient(task.assigneeEmail || 'singha@gistda.or.th');
      setCcEmail(task.backupAssigneeEmail || 'backup@gistda.or.th');
      const prefix =
        task.status === 'เกินกำหนด'
          ? `[แจ้งเตือนด่วน - เกินกำหนด ${task.overdueDays || 1} วัน]`
          : task.priority === 'สูง'
          ? '[ด่วนที่สุด - ระดับสูง]'
          : '[แจ้งเตือนการปฏิบัติงาน]';
      setSubject(`${prefix} ${task.title} (${task.id})`);
      setCustomMessage(
        task.status === 'เกินกำหนด'
          ? `เรียน คุณ${task.assignee}\n\nรายการหนังสือเลขที่ ${task.id} เกินกำหนดส่งมอบมาแล้ว กรุณาเร่งรัดและอัปเดตความคืบหน้าเข้าสู่ระบบโดยด่วน`
          : `เรียน คุณ${task.assignee}\n\nรายการหนังสือเลขที่ ${task.id} ใกล้ถึงกำหนดส่งมอบตามแผนงาน ขอความกรุณาตรวจสอบความคืบหน้าและรายงานผลการดำเนินงาน`
      );
      setIsSuccess(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    playNotificationChime(task.priority);

    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);

      onEmailSent?.({
        taskId: task.id,
        taskTitle: task.title,
        recipient,
        subject,
        priority: task.priority,
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 900);
  };

  // Generate mailto URL for direct opening in default email client / Gmail
  const mailtoBody = `${customMessage}\n\n--- ข้อมูลหนังสือและภารกิจ ---\nเลขที่หนังสือ: ${task.id}\nรายการ: ${task.title}\nผู้รับผิดชอบหลัก: ${task.assignee}\nผู้รับผิดชอบแทน: ${task.backupAssignee || '-'}\nวันที่รับ / มอบหมาย: ${task.startDate}\nกำหนดส่ง: ${task.dueDate}\nความคืบหน้า: ${task.progress}%\nความสำคัญ: ${task.priority}\nขั้นตอนถัดไป / สิ่งที่ต้องทำ: ${task.nextSteps || '-'}\nปัญหา / สิ่งที่ต้องการให้ช่วย: ${task.issues || '-'}\nวันที่อัปเดตล่าสุด: ${task.updatedAt || '-'}\nลิงก์ข้อมูล / ผลงาน: ${task.deliverableLink || '-'}\nหมายเหตุ: ${task.notes || '-'}\n\nระบบติดตามงาน สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)`;
  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?cc=${encodeURIComponent(ccEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                ส่งอีเมลแจ้งเตือนหนังสือและภารกิจ
              </h3>
              <p className="text-xs text-slate-500">
                แจ้งเตือนผู้รับผิดชอบหลักและสำเนาผู้เกี่ยวข้องผ่านระบบอีเมลองค์กร
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSend} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Success State Overlay */}
          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-center space-y-2 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-base text-emerald-800">
                ส่งอีเมลแจ้งเตือนสำเร็จแล้ว!
              </h4>
              <p className="text-xs text-emerald-700">
                ระบบได้ส่งอีเมลแจ้งเตือนไปยัง <b>{recipient}</b> เรียบร้อยแล้ว
              </p>
            </div>
          )}

          {!isSuccess && (
            <>
              {/* Task Quick Summary Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">เลขที่หนังสือ:</span>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {task.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        task.priority === 'สูง'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'ปานกลาง'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      ความสำคัญ: {task.priority}
                    </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        task.status === 'เกินกำหนด'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">รายการ:</span>
                  <div className="text-sm font-bold text-slate-900">{task.title}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400">ผู้รับผิดชอบหลัก:</span> {task.assignee}
                  </div>
                  <div>
                    <span className="text-slate-400">ผู้รับผิดชอบแทน:</span> {task.backupAssignee || '-'}
                  </div>
                  <div>
                    <span className="text-slate-400">กำหนดส่ง:</span>{' '}
                    <span className="font-semibold text-rose-600">{task.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">วันที่รับ/มอบหมาย:</span> {task.startDate}
                  </div>
                  <div>
                    <span className="text-slate-400">ความคืบหน้า:</span>{' '}
                    <span className="font-mono font-semibold">{task.progress}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">อัปเดตล่าสุด:</span> {task.updatedAt || '-'}
                  </div>
                </div>

                {/* Next Steps & Issues mini view */}
                {(task.nextSteps || task.issues) && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                    {task.nextSteps && (
                      <div className="text-slate-700">
                        <span className="font-semibold text-blue-700">ขั้นตอนถัดไป:</span> {task.nextSteps}
                      </div>
                    )}
                    {task.issues && task.issues !== '-' && task.issues !== 'ไม่มีปัญหา' && (
                      <div className="text-rose-700">
                        <span className="font-semibold text-rose-700">ปัญหา/สิ่งที่ต้องการช่วย:</span> {task.issues}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recipient & CC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    ผู้รับผิดชอบหลัก <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="email@gistda.or.th"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    ผู้รับผิดชอบแทน
                  </label>
                  <input
                    type="email"
                    value={ccEmail}
                    onChange={(e) => setCcEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="backup@gistda.or.th"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  หัวข้ออีเมล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Custom Message */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ข้อความเพิ่มเติมในเนื้อหาอีเมล:
                </label>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                  placeholder="พิมพ์ข้อความที่ต้องการแจ้งเตือน..."
                />
              </div>

              {/* Options */}
              <div className="pt-1 flex items-center justify-between text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeDetails}
                    onChange={(e) => setIncludeDetails(e.target.checked)}
                    className="rounded-xs text-blue-600"
                  />
                  <span>แนบรายละเอียดขั้นตอนถัดไป, ปัญหา, ลิงก์ผลงาน และหมายเหตุ</span>
                </label>

                <a
                  href={mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium cursor-pointer"
                  title="เปิดเขียนในโปรแกรมอีเมลของคุณโดยตรง"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  เปิดใน Gmail จริง
                </a>
              </div>
            </>
          )}

          {/* Buttons Footer */}
          {!isSuccess && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'กำลังประมวลผลส่ง...' : 'กดส่งอีเมลทันที'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
