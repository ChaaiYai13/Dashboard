import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { StatusDonutChart } from './components/StatusDonutChart';
import { ProjectProgressCard } from './components/ProjectProgressCard';
import { AssigneeBarChart } from './components/AssigneeBarChart';
import { OverdueWidget } from './components/OverdueWidget';
import { TaskTable } from './components/TaskTable';
import { GoogleSheetsPreview } from './components/GoogleSheetsPreview';
import { TaskFormCard } from './components/TaskFormCard';
import { EmailNotificationCard } from './components/EmailNotificationCard';
import { AppsScriptModal } from './components/AppsScriptModal';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { DiagramView } from './components/DiagramView';
import { initialTasks } from './data/initialTasks';
import { Task, TaskStatus } from './types/task';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'new-task' | 'reports' | 'diagram' | 'settings'>('home');
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('task_tracker_tasks_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved tasks:', e);
    }
    return initialTasks;
  });

  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | 'ทั้งหมด'>('ทั้งหมด');
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusedTaskForPreview, setFocusedTaskForPreview] = useState<Task | undefined>(undefined);
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Save tasks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('task_tracker_tasks_v1', JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [tasks]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Reset to initial 128 tasks matching the screenshot
  const handleResetData = () => {
    setTasks(initialTasks);
    setSelectedFilter('ทั้งหมด');
    setSelectedAssignee(null);
    setSelectedProject(null);
    setEditingTask(null);
    showToast('รีเซ็ตข้อมูลตัวอย่าง 128 งานตามหน้าจอต้นแบบเรียบร้อยแล้ว', 'info');
  };

  // Add or edit task
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask || taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
      showToast(`บันทึกการแก้ไขงาน ${taskData.id} เรียบร้อยแล้ว`, 'success');
      setEditingTask(null);
    } else {
      // Create new
      const nextNum = tasks.length + 1;
      const newId = `TASK-${String(nextNum).padStart(3, '0')}`;
      const newTask: Task = {
        id: newId,
        title: taskData.title || 'งานใหม่',
        project: taskData.project || 'โครงการพัฒนาระบบติดตาม',
        assignee: taskData.assignee || 'นาย A',
        startDate: taskData.startDate || '10 ต.ค. 69',
        dueDate: taskData.dueDate || '17 ต.ค. 69',
        status: taskData.status || 'กำลังดำเนินการ',
        progress: taskData.progress ?? 0,
        priority: taskData.priority || 'ปานกลาง',
        note: taskData.note || '-',
      };

      setTasks((prev) => [newTask, ...prev]);
      showToast(`เพิ่มงานใหม่ ${newId} สำเร็จ`, 'success');
    }
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`ลบงาน ${taskId} เรียบร้อยแล้ว`, 'info');
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  };

  // Select task for edit or jump to form
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFocusedTaskForPreview(task);

    // If on another tab, switch to home or task form
    if (activeTab === 'new-task') {
      // stays here
    } else if (activeTab !== 'home') {
      setActiveTab('home');
    }

    // Smooth scroll down to the edit form
    setTimeout(() => {
      const formEl = document.getElementById('task-form-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Click on overdue widget row or email view
  const handleSelectTaskFromWidget = (task: Task) => {
    setFocusedTaskForPreview(task);
    setEditingTask(task);
    setTimeout(() => {
      const formEl = document.getElementById('task-form-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Switch filter to overdue tasks only
  const handleViewAllOverdue = () => {
    setSelectedFilter('เกินกำหนด');
    const tableEl = document.getElementById('task-table-section');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Export CSV download
  const handleExportCSV = () => {
    const headers = ['รหัสงาน', 'งาน/โครงการ', 'ผู้รับผิดชอบ', 'วันที่เริ่ม', 'กำหนดส่ง', 'สถานะ', '% ความคืบหน้า', 'ความสำคัญ', 'หมายเหตุ'];
    const rows = tasks.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.assignee,
      t.startDate,
      t.dueDate,
      t.status,
      `${t.progress}%`,
      t.priority,
      `"${(t.note || '-').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `task-tracking-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว', 'success');
  };

  // Export JSON download
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(tasks, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `task-tracking-export-${Date.now()}.json`;
    link.click();
    showToast('ดาวน์โหลดไฟล์ JSON เรียบร้อยแล้ว', 'success');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-['Prompt','Kanit',sans-serif]">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentDateText="วันที่ 10 ต.ค. 2569"
        onOpenAppsScriptModal={() => setIsAppsScriptModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs sm:text-sm font-medium flex items-center gap-2 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : toastMessage.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-blue-50 border-blue-300 text-blue-900'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: หน้าหลัก (DASHBOARD) - Pixel-perfect match of uploaded screenshot */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* ROW 1: ภาพรวมสถานะงาน (Left: 4 Metric Cards, Right: Donut Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-8">
                <MetricCards
                  tasks={tasks}
                  selectedFilter={selectedFilter}
                  onSelectFilter={(status) => setSelectedFilter(status)}
                />
              </div>
              <div className="lg:col-span-4">
                <StatusDonutChart
                  tasks={tasks}
                  selectedFilter={selectedFilter}
                  onSelectFilter={(status) => setSelectedFilter(status)}
                />
              </div>
            </div>

            {/* ROW 2: 3 Analytics Cards (Project Progress, Assignee Bar Chart, Top 5 Overdue) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {/* ความคืบหน้าแต่ละโครงการ */}
              <div>
                <ProjectProgressCard
                  tasks={tasks}
                  selectedProject={selectedProject}
                  onSelectProject={setSelectedProject}
                />
              </div>

              {/* งานแยกตามผู้รับผิดชอบ */}
              <div>
                <AssigneeBarChart
                  tasks={tasks}
                  selectedAssignee={selectedAssignee}
                  onSelectAssignee={setSelectedAssignee}
                />
              </div>

              {/* งานที่เกินกำหนด (Top 5) */}
              <div>
                <OverdueWidget
                  tasks={tasks}
                  onSelectTask={handleSelectTaskFromWidget}
                  onViewAllOverdue={handleViewAllOverdue}
                />
              </div>
            </div>

            {/* ROW 3: รายการงาน (Task Table with search, filters, pagination) */}
            <div id="task-table-section">
              <TaskTable
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onAddNewTask={() => {
                  setEditingTask(null);
                  const formEl = document.getElementById('task-form-section');
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                selectedAssignee={selectedAssignee}
                setSelectedAssignee={setSelectedAssignee}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                onExportCSV={handleExportCSV}
              />
            </div>

            {/* ROW 4: 3 Bottom Cards (Google Sheets View, Task Form, Email Alert Card) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {/* Card 1: มุมมองใน Google Sheet (ข้อมูลพื้นฐาน) */}
              <div>
                <GoogleSheetsPreview
                  tasks={tasks}
                  onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
                  onExportCSV={handleExportCSV}
                />
              </div>

              {/* Card 2: ฟอร์มเพิ่ม/แก้ไขงาน */}
              <div id="task-form-section">
                <TaskFormCard
                  editingTask={editingTask}
                  onSaveTask={handleSaveTask}
                  onCancel={() => setEditingTask(null)}
                />
              </div>

              {/* Card 3: ตัวอย่างการแจ้งเตือนอัตโนมัติ (Email) */}
              <div>
                <EmailNotificationCard
                  task={focusedTaskForPreview || tasks[0]}
                  onViewTaskDetail={handleSelectTaskFromWidget}
                  onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: รายการงาน (Full Task List View) */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  ระบบบริหารจัดการงานทั้งหมด
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ค้นหา แก้ไข และติดตามสถานะความคืบหน้ารายการงานทุกโครงการ
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('new-task');
                }}
                className="px-4 py-2 bg-[#1976d2] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                + เพิ่มงานใหม่
              </button>
            </div>

            <TaskTable
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAddNewTask={() => {
                setActiveTab('new-task');
              }}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              selectedAssignee={selectedAssignee}
              setSelectedAssignee={setSelectedAssignee}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {/* TAB 3: เพิ่มงาน (Dedicated Create Task View) */}
        {activeTab === 'new-task' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-xl font-bold text-slate-900">
                เพิ่มงานและโครงการใหม่
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                กรอกข้อมูลรายละเอียดเพื่อนำเข้าสู่ Google Sheets และระบบติดตาม
              </p>
            </div>

            <TaskFormCard
              editingTask={editingTask}
              onSaveTask={(task) => {
                handleSaveTask(task);
                setActiveTab('tasks');
              }}
              onCancel={() => {
                setEditingTask(null);
                setActiveTab('tasks');
              }}
            />
          </div>
        )}

        {/* TAB 4: รายงาน (Reports View) */}
        {activeTab === 'reports' && (
          <ReportsView
            tasks={tasks}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
          />
        )}

        {/* TAB 5: ไดอะแกรม & รายละเอียดผู้ดูแลระบบ (Diagram & Admin View) */}
        {activeTab === 'diagram' && (
          <DiagramView
            onOpenAppsScriptModal={() => setIsAppsScriptModalOpen(true)}
            onGoToSettings={() => setActiveTab('settings')}
          />
        )}

        {/* TAB 6: ตั้งค่า (Settings View) */}
        {activeTab === 'settings' && (
          <SettingsView
            onOpenAppsScript={() => setIsAppsScriptModalOpen(true)}
            onResetData={handleResetData}
            onGoToDiagram={() => setActiveTab('diagram')}
          />
        )}
      </main>

      {/* Google Apps Script Modal */}
      <AppsScriptModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
      />
    </div>
  );
}
