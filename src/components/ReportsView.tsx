import React from 'react';
import { Task, TaskPriority } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertTriangle, Download, ShieldCheck } from 'lucide-react';

interface ReportsViewProps {
  tasks: Task[];
  onExportCsv: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tasks, onExportCsv }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const inProgress = tasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const overdue = tasks.filter((t) => t.status === 'เกินกำหนด').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const priorities: { name: TaskPriority; label: string; color: string; badgeColor: string }[] = [
    { name: 'สูง', label: 'ความสำคัญ: สูง', color: 'text-rose-600', badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200' },
    { name: 'ปานกลาง', label: 'ความสำคัญ: ปานกลาง', color: 'text-amber-600', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { name: 'ต่ำ', label: 'ความสำคัญ: ต่ำ', color: 'text-emerald-600', badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            รายงานและสถิติประสิทธิภาพการดำเนินงาน
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            สรุปผลการดำเนินงานตามหนังสือและภารกิจ การส่งมอบงานตามกำหนด และสถิติรายบุคคล
          </p>
        </div>
        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs w-fit cursor-pointer"
        >
          <Download className="w-4 h-4" />
          ส่งออกรายงาน (.CSV)
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">อัตราความสำเร็จโดยรวม</div>
          <div className="text-3xl font-bold font-mono text-emerald-600 mt-2">{completionRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">{completed} จาก {total} รายการ</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">รายการกำลังดำเนินการ</div>
          <div className="text-3xl font-bold font-mono text-blue-600 mt-2">{inProgress}</div>
          <div className="text-[11px] text-slate-400 mt-1">กำลังติดตามความคืบหน้า</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">รายการเกินกำหนดสะสม</div>
          <div className="text-3xl font-bold font-mono text-rose-600 mt-2">{overdue}</div>
          <div className="text-[11px] text-rose-500 font-medium mt-1">ต้องได้รับการเร่งรัด</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">ประสิทธิภาพการส่งมอบตรงเวลา</div>
          <div className="text-3xl font-bold font-mono text-purple-600 mt-2">
            {total > 0 ? Math.round(((total - overdue) / total) * 100) : 92}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">รายการส่งมอบทันตามแผน</div>
        </div>
      </div>

      {/* Priority Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            รายงานความคืบหน้าแยกตามระดับความสำคัญ
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-5">ระดับความสำคัญ</th>
                <th className="py-3 px-5 text-center">รายการทั้งหมด</th>
                <th className="py-3 px-5 text-center">เสร็จสิ้น</th>
                <th className="py-3 px-5 text-center">กำลังทำ</th>
                <th className="py-3 px-5 text-center">เกินกำหนด</th>
                <th className="py-3 px-5">ความก้าวหน้าเฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priorities.map((item, idx) => {
                const pTasks = tasks.filter((t) => t.priority === item.name);
                const pCompleted = pTasks.filter((t) => t.status === 'เสร็จสิ้น').length;
                const pProgress = pTasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
                const pOverdue = pTasks.filter((t) => t.status === 'เกินกำหนด').length;
                const avgProgress = pTasks.length > 0
                  ? Math.round(pTasks.reduce((s, t) => s + t.progress, 0) / pTasks.length)
                  : 0;

                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-semibold">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${item.badgeColor}`}>
                        {item.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono font-semibold text-slate-700">
                      {pTasks.length}
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-emerald-600 font-medium">
                      {pCompleted}
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-blue-600 font-medium">
                      {pProgress}
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-rose-600 font-medium">
                      {pOverdue}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.name === 'สูง'
                                ? 'bg-rose-500'
                                : item.name === 'ปานกลาง'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-700 font-medium">{avgProgress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">
            สถิติภาระงานและผลงานผู้รับผิดชอบหลัก
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3 px-5">ผู้รับผิดชอบหลัก</th>
                <th className="py-3 px-5">ตำแหน่ง / หน้าที่</th>
                <th className="py-3 px-5">อีเมลองค์กร</th>
                <th className="py-3 px-5 text-center">ภาระงานปัจจุบัน</th>
                <th className="py-3 px-5 text-center">รายการที่เสร็จสิ้น</th>
                <th className="py-3 px-5 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TEAM_MEMBERS.map((member, idx) => {
                const userTasks = tasks.filter((t) => t.assignee === member.name);
                const userDone = userTasks.filter((t) => t.status === 'เสร็จสิ้น').length;

                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: member.color }}
                      />
                      {member.name}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{member.role}</td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">{member.email}</td>
                    <td className="py-3.5 px-5 text-center font-mono font-bold text-blue-700">
                      {userTasks.length > 0 ? userTasks.length : member.activeCount}
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-emerald-600 font-medium">
                      {userDone}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        ปฏิบัติงานปกติ
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
