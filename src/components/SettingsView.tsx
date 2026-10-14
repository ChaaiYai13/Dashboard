import React, { useState } from 'react';
import { Settings, Save, RefreshCw, FileSpreadsheet, Code2, Bell, Check, Users } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/initialData';

interface SettingsViewProps {
  onOpenAppsScript: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenAppsScript,
  onResetData,
}) => {
  const [sheetUrl, setSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  );
  const [appsScriptUrl, setAppsScriptUrl] = useState(
    'https://script.google.com/macros/s/AKfycbz_example_tracker_api/exec'
  );
  const [alertDaysBefore, setAlertDaysBefore] = useState(3);
  const [dailyTriggerHour, setDailyTriggerHour] = useState('08:30');
  const [enableLineNotify, setEnableLineNotify] = useState(false);
  const [lineToken, setLineToken] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              การตั้งค่าระบบ
            </h2>
            <p className="text-xs text-slate-500">
              จัดการการเชื่อมต่อ Google Sheets, Google Apps Script และรอบการแจ้งเตือน
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAppsScript}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
        >
          <Code2 className="w-4 h-4" />
          ดูโค้ด Apps Script
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          บันทึกการตั้งค่าเรียบร้อยแล้ว การเชื่อมโยงและเงื่อนไขการแจ้งเตือนจะมีผลทันที
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Google Workspace Connection Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              การเชื่อมต่อ Google Sheets & Apps Script Web App
            </h3>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Google Spreadsheet URL
              </label>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                ระบบจะอ่านและอัปเดตข้อมูลแถวในชีตชื่อ 'งานทั้งหมด' อัตโนมัติ
              </p>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Apps Script Web App Endpoint URL
              </label>
              <input
                type="text"
                value={appsScriptUrl}
                onChange={(e) => setAppsScriptUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Notifications Setting Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              เงื่อนไขการแจ้งเตือนอัตโนมัติ
            </h3>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  แจ้งเตือนล่วงหน้า (วัน)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={alertDaysBefore}
                  onChange={(e) => setAlertDaysBefore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">ค่าเริ่มต้น: 3 วันก่อนกำหนดส่ง</p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  เวลาส่งแจ้งเตือนรายวัน
                </label>
                <input
                  type="text"
                  value={dailyTriggerHour}
                  onChange={(e) => setDailyTriggerHour(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">ส่งผ่าน Gmail Service ของ Google Workspace</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableLineNotify}
                  onChange={(e) => setEnableLineNotify(e.target.checked)}
                  className="rounded-xs text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700">
                  ส่งการแจ้งเตือนคู่ขนานไปยัง LINE Notify หรือ Google Chat Webhook ด้วย
                </span>
              </label>

              {enableLineNotify && (
                <div className="mt-3">
                  <label className="block font-medium text-slate-700 mb-1">
                    Webhook URL / LINE Notify Token
                  </label>
                  <input
                    type="password"
                    placeholder="วาง Webhook URL หรือ Token ที่นี่"
                    value={lineToken}
                    onChange={(e) => setLineToken(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Members Directory Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                รายชื่อผู้รับผิดชอบหลักและผู้รับผิดชอบแทน
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              สำหรับเลือกในฟอร์มและระบบแจ้งเตือน
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TEAM_MEMBERS.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: member.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {idx + 1}. {member.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {member.role}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {member.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Reset & Tools */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-900 text-xs">รีเซ็ตชุดข้อมูลตัวอย่าง</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              คืนค่า 128 รายการงานมาตรฐานตามข้อมูลระบบ GISTDA
            </p>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            คืนค่าข้อมูลเริ่มต้น
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            บันทึกการตั้งค่าทั้งหมด
          </button>
        </div>
      </form>
    </div>
  );
};
