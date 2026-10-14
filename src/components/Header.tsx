import React, { useState } from 'react';
import { 
  Home, 
  ListTodo, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  Calendar, 
  User, 
  ChevronDown,
  CheckCircle2,
  FileSpreadsheet,
  Code2,
  LogOut,
  RefreshCw,
  Network
} from 'lucide-react';
import { GoogleSheetsIcon, GoogleAppsScriptIcon } from './Icons';

interface HeaderProps {
  activeTab: 'home' | 'tasks' | 'new-task' | 'reports' | 'diagram' | 'settings';
  setActiveTab: (tab: 'home' | 'tasks' | 'new-task' | 'reports' | 'diagram' | 'settings') => void;
  currentDateText: string;
  onOpenAppsScriptModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentDateText,
  onOpenAppsScriptModal,
  onResetData,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('ผู้ใช้งาน (Admin)');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Brand Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 shadow-xs">
              <GoogleSheetsIcon className="w-7 h-7" />
            </div>

            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <span>ระบบติดตามงาน</span>
                  <span className="text-slate-300 font-light hidden sm:inline">|</span>
                  <span className="text-sm sm:text-base font-semibold text-slate-600 hidden sm:inline">
                    Task Tracking System
                  </span>
                </h1>
              </div>

              {/* Google Sheets + Apps Script Integration Badge */}
              <div 
                onClick={onOpenAppsScriptModal}
                className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer group shadow-2xs"
                title="คลิกเพื่อดูการเชื่อมต่อ Google Sheets และ Google Apps Script"
              >
                <GoogleSheetsIcon className="w-4 h-4" />
                <span className="font-semibold text-emerald-800">Google Sheets</span>
                <span className="text-slate-400 font-bold">+</span>
                <GoogleAppsScriptIcon className="w-4 h-4" />
                <span className="font-semibold text-blue-800">Google Apps Script</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" title="เชื่อมต่อแล้ว"></span>
              </div>
            </div>
          </div>

          {/* Right Controls: Date & User Profile */}
          <div className="flex items-center gap-3">
            {/* Date Display */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-lg text-xs sm:text-sm font-medium text-slate-700 border border-slate-200/80">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{currentDateText}</span>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg text-xs sm:text-sm font-medium text-blue-900 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>{selectedUser}</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-700" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 text-xs">
                    <p className="font-semibold text-slate-800">เข้าสู่ระบบในชื่อ</p>
                    <p className="text-slate-500 truncate">singha13@gmail.com</p>
                  </div>
                  <div className="py-1">
                    {['ผู้ใช้งาน (Admin)', 'นาย A (ผู้รับผิดชอบ)', 'นาย B', 'นางสาว C'].map((u) => (
                      <button
                        key={u}
                        onClick={() => {
                          setSelectedUser(u);
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                          selectedUser === u ? 'font-semibold text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <span>{u}</span>
                        {selectedUser === u && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        onResetData();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>รีเซ็ตข้อมูลตัวอย่าง 128 งาน</span>
                    </button>
                    <button
                      onClick={onOpenAppsScriptModal}
                      className="w-full text-left px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>ดูสคริปต์ Apps Script (.gs)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar (Navy Blue tone matching the screenshot) */}
      <div className="bg-[#1b3a5b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#1976d2] text-white shadow-xs font-semibold'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>หน้าหลัก</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-[#1976d2] text-white shadow-xs font-semibold'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>รายการงาน</span>
            </button>

            <button
              onClick={() => setActiveTab('new-task')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'new-task'
                  ? 'bg-[#1976d2] text-white shadow-xs font-semibold'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มงาน</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#1976d2] text-white shadow-xs font-semibold'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>รายงาน</span>
            </button>

            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'diagram'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold ring-1 ring-amber-300'
                  : 'text-amber-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Network className="w-4 h-4 text-amber-300" />
              <span>ไดอะแกรม & Admin</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1976d2] text-white shadow-xs font-semibold'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>ตั้งค่า</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
