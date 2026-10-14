import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Calendar,
  Save,
  X,
  Edit3,
  Link as LinkIcon,
  AlertCircle,
  ListChecks,
  UserCheck,
  FileText,
  Clock
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';

interface TaskFormProps {
  initialTask?: Task | null;
  onSaveTask: (taskData: Omit<Task, 'id'> & { id?: string }) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  onSaveTask,
  onCancel,
}) => {
  const [docNumber, setDocNumber] = useState('');
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [backupAssignee, setBackupAssignee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('ปานกลาง');
  const [status, setStatus] = useState<TaskStatus>('ยังไม่เริ่ม');
  const [progress, setProgress] = useState<number>(0);
  const [nextSteps, setNextSteps] = useState('');
  const [issues, setIssues] = useState('');
  const [updatedAt, setUpdatedAt] = useState('14 ต.ค. 69');
  const [deliverableLink, setDeliverableLink] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setDocNumber(initialTask.id);
      setTitle(initialTask.title);
      setAssignee(initialTask.assignee);
      setBackupAssignee(initialTask.backupAssignee || '');
      setStartDate(initialTask.startDate);
      setDueDate(initialTask.dueDate);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setProgress(initialTask.progress || 0);
      setNextSteps(initialTask.nextSteps || '');
      setIssues(initialTask.issues || '');
      setUpdatedAt(initialTask.updatedAt || '14 ต.ค. 69');
      setDeliverableLink(initialTask.deliverableLink || '');
      setNotes(initialTask.notes || '');
    } else {
      resetForm();
    }
  }, [initialTask]);

  const resetForm = () => {
    setDocNumber('');
    setTitle('');
    setAssignee('');
    setBackupAssignee('');
    setStartDate('14 ต.ค. 69');
    setDueDate('21 ต.ค. 69');
    setPriority('ปานกลาง');
    setStatus('กำลังดำเนินการ');
    setProgress(0);
    setNextSteps('');
    setIssues('');
    setUpdatedAt('14 ต.ค. 69');
    setDeliverableLink('');
    setNotes('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณากรอกรายการ');
      return;
    }
    if (!assignee) {
      setError('กรุณาเลือกผู้รับผิดชอบหลัก');
      return;
    }

    const assignedMember = TEAM_MEMBERS.find((m) => m.name === assignee);
    const backupMember = TEAM_MEMBERS.find((m) => m.name === backupAssignee);

    onSaveTask({
      id: docNumber.trim() || initialTask?.id,
      title: title.trim(),
      assignee,
      assigneeEmail: assignedMember?.email || 'singha@gistda.or.th',
      backupAssignee: backupAssignee || undefined,
      backupAssigneeEmail: backupMember?.email,
      startDate: startDate || '14 ต.ค. 69',
      dueDate: dueDate || '21 ต.ค. 69',
      priority,
      status,
      progress: Number(progress),
      nextSteps: nextSteps.trim(),
      issues: issues.trim(),
      updatedAt: updatedAt.trim() || '14 ต.ค. 69',
      deliverableLink: deliverableLink.trim(),
      notes: notes.trim(),
    });

    if (!initialTask) {
      resetForm();
    }
  };

  const handleProgressChange = (val: number) => {
    setProgress(val);
    if (val === 100) {
      setStatus('เสร็จสิ้น');
    } else if (val > 0 && status === 'ยังไม่เริ่ม') {
      setStatus('กำลังดำเนินการ');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 sm:px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            {initialTask ? <Edit3 className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
          </div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            ฟอร์มบันทึก / แก้ไขข้อมูลหนังสือและภารกิจ
          </h3>
        </div>
        {initialTask && (
          <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm font-semibold">
            {initialTask.id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex-1 flex flex-col justify-between space-y-4 text-xs overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 text-sm">
              {initialTask ? `แก้ไขข้อมูล: ${initialTask.id}` : 'เพิ่มรายการใหม่'}
            </h4>
            <span className="text-[11px] text-slate-400">
              * ฟิลด์ที่จำเป็นต้องกรอก
            </span>
          </div>

          {error && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[11px]">
              {error}
            </div>
          )}

          {/* 1. เลขที่หนังสือ & 2. รายการ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                เลขที่หนังสือ
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="เช่น อว 0601/ว 101"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                รายการ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="กรอกรายการที่ต้องดำเนินการ"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 3. ผู้รับผิดชอบหลัก & 4. ผู้รับผิดชอบแทน */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ผู้รับผิดชอบหลัก <span className="text-rose-500">*</span>
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">เลือกผู้รับผิดชอบหลัก</option>
                {TEAM_MEMBERS.map((m, idx) => (
                  <option key={idx} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ผู้รับผิดชอบแทน
              </label>
              <select
                value={backupAssignee}
                onChange={(e) => setBackupAssignee(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">ไม่มี / ไม่ระบุ</option>
                {TEAM_MEMBERS.map((m, idx) => (
                  <option key={idx} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. วันที่รับ / มอบหมาย & กำหนดส่ง */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                วันที่รับ / มอบหมาย
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="เช่น 14 ต.ค. 69"
                  className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                กำหนดส่ง
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="เช่น 21 ต.ค. 69"
                  className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* สถานะ และ ความสำคัญ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                สถานะ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="รอดำเนินการ">รอดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                <option value="เกินกำหนด">เกินกำหนด</option>
                <option value="ยกเลิก">ยกเลิก</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ความสำคัญ
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ต่ำ">ต่ำ</option>
                <option value="ปานกลาง">ปานกลาง</option>
                <option value="สูง">สูง</option>
              </select>
            </div>
          </div>

          {/* % ความคืบหน้า */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-700">
                % ความคืบหน้า:
              </label>
              <span className="font-mono font-semibold text-blue-600">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 6. ขั้นตอนถัดไป / สิ่งที่ต้องทำ */}
          <div>
            <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-blue-600" />
              ขั้นตอนถัดไป / สิ่งที่ต้องทำ
            </label>
            <input
              type="text"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="ระบุสิ่งที่ต้องดำเนินการต่อ หรือ Milestone ถัดไป"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 7. ปัญหา / สิ่งที่ต้องการให้ช่วย */}
          <div>
            <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              ปัญหา / สิ่งที่ต้องการให้ช่วย
            </label>
            <input
              type="text"
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="ระบุปัญหา อุปสรรค หรือสิ่งที่ต้องการให้ช่วยเหลือ/ทีมสนับสนุน"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 8. วันที่อัปเดตล่าสุด & 9. ลิงก์ข้อมูล / ผลงาน */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  วันที่อัปเดตล่าสุด
                </label>
                <button
                  type="button"
                  onClick={() => setUpdatedAt('14 ต.ค. 69')}
                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                >
                  ตั้งเป็นวันนี้
                </button>
              </div>
              <input
                type="text"
                value={updatedAt}
                onChange={(e) => setUpdatedAt(e.target.value)}
                placeholder="เช่น 14 ต.ค. 69"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-blue-600" />
                ลิงก์ข้อมูล / ผลงาน
              </label>
              <input
                type="url"
                value={deliverableLink}
                onChange={(e) => setDeliverableLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* 10. หมายเหตุ */}
          <div>
            <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              หมายเหตุ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="กรอกหมายเหตุ หรือข้อความเพิ่มเติม"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              if (onCancel) onCancel();
              resetForm();
            }}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </div>
  );
};
