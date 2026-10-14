import React, { useState } from 'react';
import { X, Copy, Check, Code2, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { APPS_SCRIPT_CODE } from '../data/appsScriptCode';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Google Apps Script สำหรับเชื่อมโยงระบบติดตามงาน
              </h3>
              <p className="text-xs text-slate-500">
                โค้ดอัตโนมัติสำหรับ Google Sheets, Trigger แจ้งเตือนรายวัน และ Web App API
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Guide steps */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
              <BookOpen className="w-4 h-4 text-blue-700" />
              วิธีติดตั้งใน Google Sheets:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed text-xs">
              <li>เปิด Google Spreadsheet ของคุณ</li>
              <li>ไปที่เมนูด้านบน: <b>ส่วนขยาย (Extensions) &rarr; Apps Script</b></li>
              <li>คัดลอกโค้ดด้านล่างไปวางแทนที่โค้ดเดิมทั้งหมดในไฟล์ Code.gs</li>
              <li>กดปุ่ม <b>บันทึก (Save)</b> (ไอคอนแผ่นดิสก์)</li>
              <li>เลือกฟังก์ชัน <b>initialSetup</b> แล้วกด <b>เรียกใช้ (Run)</b> เพื่อเปิดใช้งานระบบแจ้งเตือนอัตโนมัติทุกเช้า 08:30 น.</li>
            </ol>
          </div>

          {/* Code Viewer */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] font-mono">
              <span>Code.gs (Google Apps Script)</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    คัดลอกเรียบร้อย!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    คัดลอกโค้ดทั้งหมด
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono overflow-x-auto max-h-80 leading-relaxed text-slate-300">
              <code>{APPS_SCRIPT_CODE}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ระบบทำงานอัตโนมัติบน Google Cloud & Google Workspace
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
