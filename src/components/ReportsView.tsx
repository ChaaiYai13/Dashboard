import React from 'react';
import { 
  BarChart3, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Users, 
  FolderKanban,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { Task } from '../types/task';

interface ReportsViewProps {
  tasks: Task[];
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  tasks,
  onExportCSV,
  onExportJSON,
}) => {
  const total = tasks.length || 1;
  const completed = tasks.filter((t) => t.status === 'เสร็จสิ้น').length;
  const inProgress = tasks.filter((t) => t.status === 'กำลังดำเนินการ').length;
  const overdue = tasks.filter((t) => t.status === 'เกินกำหนด').length;
  const pending = tasks.filter((t) => t.status === 'รอดำเนินการ' || t.status === 'ยังไม่เริ่ม').length;

  const completionRate = Math.round((completed / total) * 100);

  // Group by project
  const projects = [
    'โครงการพัฒนาระบบติดตาม',
    'โครงการทดสอบระบบ',
    'โครงการอบรม/พัฒนา',
    'โครงการวิจัยและพัฒนา',
  ];

  const projectStats = projects.map((p) => {
    const projTasks = tasks.filter((t) => t.project === p);
    const count = projTasks.length;
    const projDone = projTasks.filter((t) => t.status === 'เสร็จสิ้น').length;
    const projOverdue = projTasks.filter((t) => t.status === 'เกินกำหนด').length;
    const rate = count > 0 ? Math.round((projDone / count) * 100) : 0;
    return { name: p, total: count, done: projDone, overdue: projOverdue, rate };
  });

  // Group by assignee
  const assignees = ['นาย A', 'นาย B', 'นางสาว C', 'นาย D', 'นางสาว E'];
  const assigneeStats = assignees.map((a) => {
    const userTasks = tasks.filter((t) => t.assignee === a);
    const count = userTasks.length;
    const done = userTasks.filter((t) => t.status === 'เสร็จสิ้น').length;
    const overdueCount = userTasks.filter((t) => t.status === 'เกินกำหนด').length;
    return { name: a, total: count, done, overdue: overdueCount };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Actions Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>รายงานและสถิติภาพรวมโครงการ (Project Analytics)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            สรุปการปฏิบัติงานทั้งหมด {total} งาน • ประเมินอัตราความสำเร็จและความล่าช้า
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ดาวน์โหลด Excel/CSV</span>
          </button>
          <button
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span>ดาวน์โหลด JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">อัตราความสำเร็จโดยรวม</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {completionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            เสร็จสิ้น {completed} จากทั้งหมด {total} งาน
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">งานที่กำลังทำ (Active)</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
            {inProgress} <span className="text-sm font-normal text-slate-500">งาน</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            กำลังดำเนินการตามกำหนด
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">งานเกินกำหนด (Overdue)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono tabular-nums">
            {overdue} <span className="text-sm font-normal text-slate-500">งาน</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-semibold">
            ต้องการการติดตามอย่างเร่งด่วน
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase">รอดำเนินการ / ค้างคิว</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
            {pending} <span className="text-sm font-normal text-slate-500">งาน</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            พร้อมเริ่มในรอบถัดไป
          </div>
        </div>
      </div>

      {/* Project Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-600" />
            <span>สรุปตามโครงการหลัก</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">ชื่อโครงการ</th>
                <th className="py-3 px-4 text-center">งานทั้งหมด</th>
                <th className="py-3 px-4 text-center">เสร็จสิ้น</th>
                <th className="py-3 px-4 text-center">เกินกำหนด</th>
                <th className="py-3 px-4 min-w-[160px]">ความก้าวหน้า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectStats.map((p) => (
                <tr key={p.name} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-800">{p.name}</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">{p.total}</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-emerald-700 font-bold">{p.done}</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-rose-600 font-bold">{p.overdue}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${p.rate}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-700 w-10 text-right">
                        {p.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignee Workload Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>ภาระงานและความรับผิดชอบรายบุคคล</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">ผู้รับผิดชอบ</th>
                <th className="py-3 px-4 text-center">งานในมือทั้งหมด</th>
                <th className="py-3 px-4 text-center">เสร็จสิ้นแล้ว</th>
                <th className="py-3 px-4 text-center">งานเกินกำหนด</th>
                <th className="py-3 px-4 text-center">สถานะความพร้อม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assigneeStats.map((a) => (
                <tr key={a.name} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-800">{a.name}</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">{a.total} งาน</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-emerald-700 font-bold">{a.done} งาน</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-rose-600 font-bold">{a.overdue} งาน</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        a.overdue > 3
                          ? 'bg-rose-100 text-rose-800'
                          : a.overdue > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {a.overdue > 3 ? 'ภาระงานสูง' : a.overdue > 0 ? 'ปกติ (มีงานล่าช้า)' : 'ปฏิบัติงานราบรื่น'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
