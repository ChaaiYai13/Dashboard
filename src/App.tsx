import React, { useState, useEffect, useRef } from 'react';
import {
  Task,
  TaskStatus,
  TaskPriority,
  ViewTab,
  PriorityNotificationRule,
  NotificationItem,
  NotificationLog
} from './types';
import { ALL_INITIAL_TASKS } from './data/initialData';
import { DEFAULT_PRIORITY_RULES, generateNotificationsFromTasks } from './data/notificationRules';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { StatusDonutChart } from './components/StatusDonutChart';
import { PriorityProgressCard } from './components/PriorityProgressCard';
import { AssigneeBarChart } from './components/AssigneeBarChart';
import { TopOverdueCard } from './components/TopOverdueCard';
import { TaskTable } from './components/TaskTable';
import { SheetGridView } from './components/SheetGridView';
import { TaskForm } from './components/TaskForm';
import { NotificationPreview } from './components/NotificationPreview';
import { AppsScriptModal } from './components/AppsScriptModal';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationSettingsHub } from './components/NotificationSettingsHub';
import { SendEmailModal } from './components/SendEmailModal';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const STORAGE_KEY = 'gistda_task_tracker_data_v3';
const RULES_KEY = 'gistda_priority_rules_v2';
const NOTIFS_KEY = 'gistda_notifications_v2';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ALL_INITIAL_TASKS;
  });

  const [rules, setRules] = useState<Record<string, PriorityNotificationRule>>(() => {
    try {
      const saved = localStorage.getItem(RULES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRIORITY_RULES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return generateNotificationsFromTasks(ALL_INITIAL_TASKS);
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([
    {
      id: 'LOG-001',
      taskId: 'TASK-023',
      taskTitle: 'ทดสอบระบบ',
      recipient: 'b.qa@gistda.or.th',
      priority: 'สูง',
      triggerType: 'งานเกินกำหนด 9 วัน',
      channel: 'Email & LINE',
      sentAt: 'วันนี้ 08:30 น.',
      status: 'สำเร็จ',
    },
    {
      id: 'LOG-002',
      taskId: 'TASK-001',
      taskTitle: 'พัฒนาระบบติดตาม',
      recipient: 'a.dev@gistda.or.th',
      priority: 'สูง',
      triggerType: 'เตือนล่วงหน้า 3 วัน',
      channel: 'Email',
      sentAt: 'เมื่อวานนี้ 09:00 น.',
      status: 'สำเร็จ',
    },
    {
      id: 'LOG-003',
      taskId: 'TASK-004',
      taskTitle: 'ประชุมทีม',
      recipient: 'd.mgmt@gistda.or.th',
      priority: 'ปานกลาง',
      triggerType: 'เตือนล่วงหน้า 1 วัน',
      channel: 'In-App',
      sentAt: 'เมื่อวานนี้ 08:30 น.',
      status: 'สำเร็จ',
    },
  ]);

  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [selectedTaskForEmailModal, setSelectedTaskForEmailModal] = useState<Task | null>(null);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; priority: string } | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(RULES_KEY, JSON.stringify(rules));
    } catch (e) {
      console.error(e);
    }
  }, [rules]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Export tasks as CSV
  const handleExportCsv = () => {
    const headers = [
      'เลขที่หนังสือ',
      'รายการ',
      'ผู้รับผิดชอบหลัก',
      'อีเมลผู้รับผิดชอบหลัก',
      'ผู้รับผิดชอบแทน',
      'วันที่รับ / มอบหมาย',
      'กำหนดส่ง',
      'สถานะ',
      '% ความคืบหน้า',
      'ความสำคัญ',
      'ขั้นตอนถัดไป / สิ่งที่ต้องทำ',
      'ปัญหา / สิ่งที่ต้องการให้ช่วย',
      'วันที่อัปเดตล่าสุด',
      'ลิงก์ข้อมูล / ผลงาน',
      'หมายเหตุ',
    ];

    const rows = tasks.map((t) => [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.assignee}"`,
      `"${t.assigneeEmail}"`,
      `"${t.backupAssignee || '-'}"`,
      t.startDate,
      t.dueDate,
      t.status,
      `${t.progress}%`,
      t.priority,
      `"${(t.nextSteps || '').replace(/"/g, '""')}"`,
      `"${(t.issues || '').replace(/"/g, '""')}"`,
      `"${t.updatedAt || ''}"`,
      `"${t.deliverableLink || ''}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `ระบบติดตามหนังสือและภารกิจ_GISTDA_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle saving new or updated task
  const handleSaveTask = (taskData: Omit<Task, 'id'> & { id?: string }) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t
        )
      );
    } else {
      const nextNum = (tasks.length + 1).toString().padStart(3, '0');
      const newTask: Task = {
        ...taskData,
        id: `อว 0601/ว ${nextNum}`,
      };
      setTasks((prev) => [newTask, ...prev]);

      // Add in-app notification for new task
      const newNotif: NotificationItem = {
        id: `NOTIF-NEW-${newTask.id}-${Date.now()}`,
        taskId: newTask.id,
        taskTitle: newTask.title,
        assignee: newTask.assignee,
        assigneeEmail: newTask.assigneeEmail,
        priority: newTask.priority,
        type: 'assigned',
        title: `มอบหมายหนังสือเลขที่ ${newTask.id}: ${newTask.title}`,
        message: `คุณ ${newTask.assignee} ได้รับมอบหมายรายการ ${newTask.title} กำหนดส่ง ${newTask.dueDate}`,
        timestamp: 'เมื่อสักครู่',
        read: false,
        channel: 'inApp',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    setSelectedTaskForEdit(null);
    if (currentTab === 'add') {
      setCurrentTab('dashboard');
    }
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm(`ต้องการลบงาน ${taskId} ใช่หรือไม่?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (selectedTaskForEdit?.id === taskId) {
        setSelectedTaskForEdit(null);
      }
    }
  };

  // Edit task trigger
  const handleEditTask = (task: Task) => {
    setSelectedTaskForEdit(task);
    if (currentTab !== 'dashboard') {
      setCurrentTab('dashboard');
    }
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Reset to initial 128 tasks
  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้น 128 งานใช่หรือไม่?')) {
      setTasks(ALL_INITIAL_TASKS);
      setRules(DEFAULT_PRIORITY_RULES);
      setNotifications(generateNotificationsFromTasks(ALL_INITIAL_TASKS));
      setSelectedTaskForEdit(null);
      setStatusFilter('all');
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Select task from notification
  const handleSelectNotificationTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      handleEditTask(target);
    }
  };

  // Open Send Email Modal popup
  const handleOpenSendEmailModal = (task: Task) => {
    setSelectedTaskForEmailModal(task);
    setIsSendEmailModalOpen(true);
  };

  // Callback when email is sent from the popup
  const handleEmailModalSent = (details: {
    taskId: string;
    taskTitle: string;
    recipient: string;
    subject: string;
    priority: TaskPriority;
  }) => {
    const newLog: NotificationLog = {
      id: `LOG-${Date.now()}`,
      taskId: details.taskId,
      taskTitle: details.taskTitle,
      recipient: details.recipient,
      priority: details.priority,
      triggerType: `ส่งอีเมลผ่าน Popup (${details.priority})`,
      channel: 'Email (Gmail)',
      sentAt: 'เมื่อสักครู่',
      status: 'สำเร็จ',
    };
    setNotificationLogs((prev) => [newLog, ...prev]);

    const newNotif: NotificationItem = {
      id: `NOTIF-MAIL-${Date.now()}`,
      taskId: details.taskId,
      taskTitle: details.taskTitle,
      assignee: details.recipient,
      assigneeEmail: details.recipient,
      priority: details.priority,
      type: 'upcoming',
      title: details.subject,
      message: `ส่งอีเมลแจ้งเตือนงาน ${details.taskId} สำเร็จแล้ว`,
      timestamp: 'เมื่อสักครู่',
      read: false,
      channel: 'email',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setActiveToast({
      title: `ส่งอีเมล ${details.taskId} สำเร็จ`,
      message: `ส่งไปยัง ${details.recipient} เรียบร้อยแล้ว`,
      priority: details.priority,
    });
    setTimeout(() => setActiveToast(null), 4500);
  };

  // Send test notification simulator
  const handleSendTestNotification = (task: Task, channel: 'email' | 'line' | 'inApp') => {
    const rule = rules[task.priority] || rules['สูง'];
    const title = rule.emailSubjectTemplate
      .replace('{taskTitle}', task.title)
      .replace('{taskId}', task.id)
      .replace('{assignee}', task.assignee);

    // 1. Add to logs
    const newLog: NotificationLog = {
      id: `LOG-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      recipient: task.assigneeEmail,
      priority: task.priority,
      triggerType: `ทดสอบระบบ (${task.priority})`,
      channel: channel === 'email' ? 'Email (Gmail)' : channel === 'line' ? 'LINE Notify' : 'In-App Alert',
      sentAt: 'เมื่อสักครู่',
      status: 'สำเร็จ',
    };
    setNotificationLogs((prev) => [newLog, ...prev]);

    // 2. Add to in-app notifications
    const newNotif: NotificationItem = {
      id: `NOTIF-TEST-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      assignee: task.assignee,
      assigneeEmail: task.assigneeEmail,
      priority: task.priority,
      type: task.status === 'เกินกำหนด' ? 'overdue' : 'upcoming',
      title: title,
      message: `แจ้งเตือนไปยัง ${task.assignee} (${task.assigneeEmail}) กำหนดส่ง ${task.dueDate} ความสำคัญระดับ${task.priority}`,
      timestamp: 'เมื่อสักครู่',
      read: false,
      channel: channel,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 3. Show transient toast
    setActiveToast({
      title: `ส่งแจ้งเตือนระดับ "${task.priority}" สำเร็จ`,
      message: `${task.id}: ${task.title} &rarr; ${task.assignee} (${channel.toUpperCase()})`,
      priority: task.priority,
    });
    setTimeout(() => setActiveToast(null), 4500);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* Toast Alert Banner */}
      {activeToast && (
        <div className="fixed top-20 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700 animate-in slide-in-from-top-4 flex items-start gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              activeToast.priority === 'สูง'
                ? 'bg-rose-600'
                : activeToast.priority === 'ปานกลาง'
                ? 'bg-amber-500'
                : 'bg-emerald-600'
            }`}
          >
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <div className="font-bold text-slate-100">{activeToast.title}</div>
            <div className="text-slate-300 text-[11px] mt-0.5 truncate">{activeToast.message}</div>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAppsScriptModal={() => setIsAppsScriptModalOpen(true)}
        onExportCsv={handleExportCsv}
        onToggleNotificationDrawer={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
        unreadCount={unreadCount}
        totalTasks={tasks.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            {/* ROW 1: ภาพรวมสถานะงาน */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-8">
                <KpiCards
                  tasks={tasks}
                  selectedStatus={statusFilter}
                  onFilterStatus={(status) => setStatusFilter(status)}
                />
              </div>
              <div className="lg:col-span-4">
                <StatusDonutChart
                  tasks={tasks}
                  onSelectStatus={(status) => setStatusFilter(status as TaskStatus)}
                />
              </div>
            </div>

            {/* ROW 2: 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              <PriorityProgressCard tasks={tasks} />
              <AssigneeBarChart
                tasks={tasks}
                onSelectAssignee={() => setStatusFilter('all')}
              />
              <TopOverdueCard
                tasks={tasks}
                onViewAllOverdue={() => setStatusFilter('เกินกำหนด')}
                onSelectTask={handleEditTask}
                onOpenSendEmailModal={handleOpenSendEmailModal}
              />
            </div>

            {/* ROW 3: รายการงาน */}
            <div>
              <TaskTable
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onAddNewTask={() => {
                  setSelectedTaskForEdit(null);
                  formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenSendEmailModal={handleOpenSendEmailModal}
                selectedStatusFilter={statusFilter}
                onFilterChange={setStatusFilter}
              />
            </div>

            {/* ROW 4: 3 Panels Side-by-Side */}
            <div ref={formSectionRef} className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
              {/* Box 1: มุมมองใน Google Sheet */}
              <div className="h-full">
                <SheetGridView
                  tasks={tasks}
                  onSelectTask={handleEditTask}
                  onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
                />
              </div>

              {/* Box 2: ฟอร์มเพิ่ม/แก้ไขงาน */}
              <div className="h-full">
                <TaskForm
                  initialTask={selectedTaskForEdit}
                  onSaveTask={handleSaveTask}
                  onCancel={() => setSelectedTaskForEdit(null)}
                />
              </div>

              {/* Box 3: ตัวอย่างการแจ้งเตือนอัตโนมัติ */}
              <div className="h-full">
                <NotificationPreview
                  onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
                  selectedTask={selectedTaskForEdit}
                  onGoToNotificationHub={() => setCurrentTab('notifications')}
                  onOpenSendEmailModal={handleOpenSendEmailModal}
                  rules={rules}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASK LIST */}
        {currentTab === 'tasks' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">รายการงานทั้งหมดในระบบ</h2>
                <p className="text-xs text-slate-500">
                  จัดการและตรวจสอบสถานะงาน กำหนดส่ง และเปอร์เซ็นต์ความคืบหน้า
                </p>
              </div>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                ดาวน์โหลด CSV
              </button>
            </div>
            <TaskTable
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddNewTask={() => setCurrentTab('add')}
              onOpenSendEmailModal={handleOpenSendEmailModal}
              selectedStatusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>
        )}

        {/* TAB 3: ADD TASK */}
        {currentTab === 'add' && (
          <div className="max-w-2xl mx-auto py-4">
            <TaskForm
              initialTask={selectedTaskForEdit}
              onSaveTask={handleSaveTask}
              onCancel={() => {
                setSelectedTaskForEdit(null);
                setCurrentTab('dashboard');
              }}
            />
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS HUB (NEW) */}
        {currentTab === 'notifications' && (
          <NotificationSettingsHub
            tasks={tasks}
            rules={rules}
            onUpdateRules={setRules}
            onSendTestNotification={handleSendTestNotification}
            logs={notificationLogs}
            onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
          />
        )}

        {/* TAB 5: REPORTS */}
        {currentTab === 'reports' && (
          <ReportsView tasks={tasks} onExportCsv={handleExportCsv} />
        )}

        {/* TAB 6: SETTINGS */}
        {currentTab === 'settings' && (
          <SettingsView
            onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* In-App Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectNotificationTask={handleSelectNotificationTask}
        onGoToSettings={() => setCurrentTab('notifications')}
      />

      {/* Apps Script Modal */}
      <AppsScriptModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
      />

      {/* Send Email Modal Popup */}
      <SendEmailModal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        task={selectedTaskForEmailModal}
        onEmailSent={handleEmailModalSent}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">ระบบติดตามงาน</span>
            <span>·</span>
            <span>สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Google Sheets & Google Apps Script Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
