import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Code2,
  Calendar,
  User,
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  BarChart3,
  Settings,
  ChevronDown,
  Download,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { ViewTab } from '../types';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenAppsScriptModal: () => void;
  onExportCsv: () => void;
  onToggleNotificationDrawer: () => void;
  unreadCount: number;
  userEmail?: string;
  totalTasks: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenAppsScriptModal,
  onExportCsv,
  onToggleNotificationDrawer,
  unreadCount,
  userEmail = 'singha@gistda.or.th',
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand Lockup */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Google Sheets Icon style */}
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-500/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="leading-tight">
                <div className="text-xl font-bold tracking-tight text-slate-900">
                  ระบบติดตามงาน
                </div>
                <div className="text-xs font-medium text-slate-500">
                  Task Tracking System
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-300 hidden md:block" />

            {/* Google Sheets + Apps Script Badge */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Google Sheets
              </span>
              <span className="text-slate-400 font-normal">+</span>
              <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                <div className="w-4 h-4 rounded-xs bg-linear-to-tr from-amber-500 via-rose-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-mono">
                  &lt;&gt;
                </div>
                Google Apps Script
              </span>
            </div>
          </div>

          {/* Right User & Notification Lockup */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Thai Date Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>วันที่ 10 ต.ค. 2569</span>
            </div>

            {/* Notification Bell with Badge */}
            <button
              onClick={onToggleNotificationDrawer}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="ศูนย์การแจ้งเตือน"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline">ผู้ใช้งาน</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{userEmail}</p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                      เชื่อมต่อระบบชีตแล้ว
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onOpenAppsScriptModal();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4 text-blue-600" />
                    ดูโค้ด Apps Script และการตั้งค่า
                  </button>
                  <button
                    onClick={() => {
                      onExportCsv();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    ส่งออกข้อมูลเป็น CSV / Sheets
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              หน้าหลัก
            </button>

            <button
              onClick={() => onTabChange('tasks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'tasks'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              รายการงาน
            </button>

            <button
              onClick={() => onTabChange('add')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'add'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              เพิ่มงาน
            </button>

            <button
              onClick={() => onTabChange('notifications')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer relative ${
                currentTab === 'notifications'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              ระบบแจ้งเตือน
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={() => onTabChange('reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              รายงาน
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              ตั้งค่า
            </button>
          </nav>

          {/* Quick utility buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenAppsScriptModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              Apps Script (.gs)
            </button>
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              ส่งออกชีต
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
