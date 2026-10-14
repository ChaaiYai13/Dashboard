import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Send,
  Mail,
  MessageSquare,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Layers,
  History,
  Volume2
} from 'lucide-react';
import { PriorityNotificationRule, Task, TaskPriority, NotificationLog } from '../types';
import { playNotificationChime } from '../utils/notificationAudio';

interface NotificationSettingsHubProps {
  tasks: Task[];
  rules: Record<string, PriorityNotificationRule>;
  onUpdateRules: (newRules: Record<string, PriorityNotificationRule>) => void;
  onSendTestNotification: (task: Task, channel: 'email' | 'line' | 'inApp') => void;
  logs: NotificationLog[];
  onOpenAppsScript: () => void;
}

export const NotificationSettingsHub: React.FC<NotificationSettingsHubProps> = ({
  tasks,
  rules,
  onUpdateRules,
  onSendTestNotification,
  logs,
  onOpenAppsScript,
}) => {
  const [activePriority, setActivePriority] = useState<TaskPriority>('สูง');
  const [selectedTestTaskId, setSelectedTestTaskId] = useState<string>(
    tasks[0]?.id || 'TASK-001'
  );
  const [testChannel, setTestChannel] = useState<'email' | 'line' | 'inApp'>('email');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [customDayInput, setCustomDayInput] = useState<number>(5);

  const currentRule = rules[activePriority] || rules['สูง'];

  const handleToggleChannel = (channel: 'email' | 'inApp' | 'lineNotify') => {
    const updated = {
      ...rules,
      [activePriority]: {
        ...currentRule,
        channels: {
          ...currentRule.channels,
          [channel]: !currentRule.channels[channel],
        },
      },
    };
    onUpdateRules(updated);
  };

  const handleToggleField = (field: 'enabled' | 'alertOnDueDate' | 'alertOnOverdue') => {
    const updated = {
      ...rules,
      [activePriority]: {
        ...currentRule,
        [field]: !currentRule[field],
      },
    };
    onUpdateRules(updated);
  };

  const handleOverdueFrequencyChange = (freq: 'daily' | 'every2days' | 'once') => {
    const updated = {
      ...rules,
      [activePriority]: {
        ...currentRule,
        overdueFrequency: freq,
      },
    };
    onUpdateRules(updated);
  };

  const handleAddDayBefore = () => {
    if (customDayInput > 0 && !currentRule.daysBeforeDue.includes(customDayInput)) {
      const newDays = [...currentRule.daysBeforeDue, customDayInput].sort((a, b) => b - a);
      const updated = {
        ...rules,
        [activePriority]: {
          ...currentRule,
          daysBeforeDue: newDays,
        },
      };
      onUpdateRules(updated);
    }
  };

  const handleRemoveDayBefore = (day: number) => {
    const newDays = currentRule.daysBeforeDue.filter((d) => d !== day);
    const updated = {
      ...rules,
      [activePriority]: {
        ...currentRule,
        daysBeforeDue: newDays,
      },
    };
    onUpdateRules(updated);
  };

  const handleSubjectChange = (subject: string) => {
    const updated = {
      ...rules,
      [activePriority]: {
        ...currentRule,
        emailSubjectTemplate: subject,
      },
    };
    onUpdateRules(updated);
  };

  const handleSaveAll = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleRunTest = () => {
    const task = tasks.find((t) => t.id === selectedTestTaskId) || tasks[0];
    playNotificationChime(task.priority);
    onSendTestNotification(task, testChannel);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTestTaskId) || tasks[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              ระบบแจ้งเตือนอัจฉริยะ (Customizable Notification Rules)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              กำหนดเงื่อนไขการแจ้งเตือนงานล่วงหน้าตามวันที่ครบกำหนดและระดับความสำคัญ (สูง / ปานกลาง / ต่ำ)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAppsScript}
            className="px-3.5 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
          >
            โค้ด Apps Script Trigger
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {savedFeedback ? 'บันทึกสำเร็จ!' : 'บันทึกกฎทั้งหมด'}
          </button>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Priority Rules Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                ตั้งค่ากฎตามระดับความสำคัญ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เลือกระดับความสำคัญเพื่อปรับแต่งกำหนดส่งและการแจ้งเตือน
              </p>
            </div>

            {/* Priority Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['สูง', 'ปานกลาง', 'ต่ำ'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activePriority === p
                      ? p === 'สูง'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : p === 'ปานกลาง'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ความสำคัญ: {p}
                </button>
              ))}
            </div>
          </div>

          {/* Rule Active Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-900">
                เปิดใช้งานระบบแจ้งเตือนสำหรับงานความสำคัญ &ldquo;{activePriority}&rdquo;
              </span>
              <p className="text-[11px] text-slate-500">
                เมื่อปิดใช้งาน งานระดับนี้จะไม่ส่งข้อความแจ้งเตือนอัตโนมัติ
              </p>
            </div>
            <button
              onClick={() => handleToggleField('enabled')}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                currentRule.enabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform absolute top-0.5 ${
                  currentRule.enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Days Before Due Date Multi-Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              แจ้งเตือนล่วงหน้าก่อนถึงกำหนดส่ง (วัน):
            </label>
            <p className="text-[11px] text-slate-500">
              ระบบจะตรวจนับวันที่เหลือและส่งข้อความเตือนในวันที่กำหนด
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentRule.daysBeforeDue.map((day) => (
                <span
                  key={day}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-medium"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  ล่วงหน้า {day} วัน
                  <button
                    onClick={() => handleRemoveDayBefore(day)}
                    className="hover:text-rose-600 ml-0.5 cursor-pointer"
                    title="ลบ"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customDayInput}
                  onChange={(e) => setCustomDayInput(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg text-center font-mono"
                  placeholder="วัน"
                />
                <button
                  onClick={handleAddDayBefore}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  เพิ่มวัน
                </button>
              </div>
            </div>
          </div>

          {/* Milestone Due Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => handleToggleField('alertOnDueDate')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                currentRule.alertOnDueDate
                  ? 'bg-blue-50/60 border-blue-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentRule.alertOnDueDate}
                  onChange={() => {}}
                  className="rounded-xs text-blue-600"
                />
                <span className="text-xs font-bold text-slate-800">
                  เตือนในวันครบกำหนดส่ง
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-5">
                ส่งแจ้งเตือนในเช้าของวัน Due Date (เวลา 08:30 น.)
              </p>
            </div>

            <div
              onClick={() => handleToggleField('alertOnOverdue')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                currentRule.alertOnOverdue
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentRule.alertOnOverdue}
                  onChange={() => {}}
                  className="rounded-xs text-rose-600"
                />
                <span className="text-xs font-bold text-slate-800">
                  เตือนเมื่องานเกินกำหนด
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-5">
                ตรวจพบงานที่ยังไม่เสร็จหลังวันกำหนดส่ง
              </p>
            </div>
          </div>

          {/* Overdue Frequency Selection */}
          {currentRule.alertOnOverdue && (
            <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-rose-900">
                ความถี่การเตือนซ้ำเมื่องานเกินกำหนด:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOverdueFrequencyChange('daily')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                    currentRule.overdueFrequency === 'daily'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  เตือนซ้ำทุกวัน (Daily)
                </button>
                <button
                  type="button"
                  onClick={() => handleOverdueFrequencyChange('every2days')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                    currentRule.overdueFrequency === 'every2days'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  เตือนทุก 2 วัน
                </button>
                <button
                  type="button"
                  onClick={() => handleOverdueFrequencyChange('once')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                    currentRule.overdueFrequency === 'once'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  เตือนครั้งเดียว
                </button>
              </div>
            </div>
          )}

          {/* Delivery Channels */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              ช่องทางการส่งแจ้งเตือน:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleToggleChannel('email')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-medium transition-colors ${
                  currentRule.channels.email
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email (Gmail)
              </button>

              <button
                type="button"
                onClick={() => handleToggleChannel('inApp')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-medium transition-colors ${
                  currentRule.channels.inApp
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                ในแอป
              </button>

              <button
                type="button"
                onClick={() => handleToggleChannel('lineNotify')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer font-medium transition-colors ${
                  currentRule.channels.lineNotify
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                LINE / Webhook
              </button>
            </div>
          </div>

          {/* Subject Template */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              เทมเพลตหัวข้ออีเมลแจ้งเตือน:
            </label>
            <input
              type="text"
              value={currentRule.emailSubjectTemplate}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-[11px] text-slate-400">
              ตัวแปรที่ใช้ได้: <code className="bg-slate-100 px-1 py-0.5 rounded">{'{taskTitle}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">{'{taskId}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">{'{assignee}'}</code>
            </p>
          </div>
        </div>

        {/* Right Column: Live Testing Simulator & Notification History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Simulator Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                ทดสอบจำลองส่งการแจ้งเตือนสด
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  เลือกรายการหนังสือที่ต้องการทดสอบ:
                </label>
                <select
                  value={selectedTestTaskId}
                  onChange={(e) => setSelectedTestTaskId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {tasks.slice(0, 10).map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.priority}] {t.id} - {t.title} - {t.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ช่องทางทดสอบ:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestChannel('email')}
                    className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      testChannel === 'email'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestChannel('inApp')}
                    className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      testChannel === 'inApp'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    In-App
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestChannel('line')}
                    className={`py-1.5 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      testChannel === 'line'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    LINE
                  </button>
                </div>
              </div>

              {/* Preview Bubble */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">ผู้รับ: {selectedTask?.assignee} ({selectedTask?.assigneeEmail})</span>
                  <span className={`font-semibold ${
                    selectedTask?.priority === 'สูง' ? 'text-rose-600' : 'text-blue-600'
                  }`}>
                    {selectedTask?.priority}
                  </span>
                </div>
                <div className="font-semibold text-slate-800">
                  {currentRule.emailSubjectTemplate
                    .replace('{taskTitle}', selectedTask?.title || '')
                    .replace('{taskId}', selectedTask?.id || '')
                    .replace('{assignee}', selectedTask?.assignee || '')}
                </div>
                <div className="text-[11px] text-slate-600">
                  กำหนดส่ง: {selectedTask?.dueDate} · สถานะ: {selectedTask?.status} ({selectedTask?.progress}%)
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunTest}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                ทดสอบยิงแจ้งเตือนทันที (พร้อมเสียงเตือน)
              </button>
            </div>
          </div>

          {/* Notification Audit Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h4 className="font-bold text-slate-900 text-xs">
                  ประวัติการส่งแจ้งเตือนล่าสุด
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {logs.length} รายการ
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800 truncate">
                      {log.taskId}: {log.taskTitle}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {log.recipient} · ช่องทาง: {log.channel}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {log.sentAt}
                    </div>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-slate-400 py-6 text-xs">
                  ยังไม่มีประวัติการส่ง
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
