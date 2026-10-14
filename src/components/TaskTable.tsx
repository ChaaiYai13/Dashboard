import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Mail,
  ExternalLink,
  AlertCircle,
  ListChecks,
  Clock,
  UserCheck
} from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface TaskTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddNewTask: () => void;
  onOpenSendEmailModal?: (task: Task) => void;
  selectedStatusFilter?: TaskStatus | 'all';
  onFilterChange?: (status: TaskStatus | 'all') => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onAddNewTask,
  onOpenSendEmailModal,
  selectedStatusFilter = 'all',
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalStatusFilter, setInternalStatusFilter] = useState<string>(selectedStatusFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync when prop changes
  React.useEffect(() => {
    setInternalStatusFilter(selectedStatusFilter);
  }, [selectedStatusFilter]);

  const handleStatusFilterChange = (val: string) => {
    setInternalStatusFilter(val);
    onFilterChange?.(val as TaskStatus | 'all');
    setCurrentPage(1);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(q) ||
        task.id.toLowerCase().includes(q) ||
        task.assignee.toLowerCase().includes(q) ||
        (task.backupAssignee && task.backupAssignee.toLowerCase().includes(q)) ||
        (task.nextSteps && task.nextSteps.toLowerCase().includes(q)) ||
        (task.issues && task.issues.toLowerCase().includes(q)) ||
        (task.notes && task.notes.toLowerCase().includes(q));

      const matchesStatus =
        internalStatusFilter === 'all' || task.status === internalStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, internalStatusFilter]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'เสร็จสิ้น':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
            เสร็จสิ้น
          </span>
        );
      case 'กำลังดำเนินการ':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">
            กำลังดำเนินการ
          </span>
        );
      case 'เกินกำหนด':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-800">
            เกินกำหนด
          </span>
        );
      case 'ยังไม่เริ่ม':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">
            ยังไม่เริ่ม
          </span>
        );
      case 'รอดำเนินการ':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-800">
            รอดำเนินการ
          </span>
        );
      case 'ยกเลิก':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            ยกเลิก
          </span>
        );
      default:
        return <span className="text-xs text-slate-600">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'สูง':
        return <span className="font-semibold text-rose-600">สูง</span>;
      case 'ปานกลาง':
        return <span className="font-semibold text-amber-600">ปานกลาง</span>;
      case 'ต่ำ':
        return <span className="font-semibold text-emerald-600">ต่ำ</span>;
      default:
        return <span className="text-slate-600">{priority}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            ตารางติดตามรายการหนังสือและภารกิจ
          </h2>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
            {filteredTasks.length} รายการ
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาเลขที่หนังสือ, รายการ, ผู้รับผิดชอบ..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Status Dropdown Filter */}
          <select
            value={internalStatusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            aria-label="กรองตามสถานะงาน"
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="รอดำเนินการ">รอดำเนินการ</option>
            <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
            <option value="เกินกำหนด">เกินกำหนด</option>
            <option value="ยกเลิก">ยกเลิก</option>
          </select>

          {/* Add Task Button */}
          <button
            onClick={onAddNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            เพิ่มรายการ
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
            <tr>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap">เลขที่หนังสือ</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap min-w-[170px]">รายการ</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap">ผู้รับผิดชอบหลัก</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap">ผู้รับผิดชอบแทน</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap">วันที่รับ / มอบหมาย</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap">กำหนดส่ง</th>
              <th className="py-3 px-3.5 font-medium text-center whitespace-nowrap">สถานะ</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap min-w-[110px]">% ความคืบหน้า</th>
              <th className="py-3 px-3.5 font-medium text-center whitespace-nowrap">ความสำคัญ</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap min-w-[150px]">ขั้นตอนถัดไป / สิ่งที่ต้องทำ</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap min-w-[140px]">ปัญหา / สิ่งที่ต้องการช่วย</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap text-center">อัปเดตล่าสุด</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap text-center">ลิงก์ผลงาน</th>
              <th className="py-3 px-3.5 font-medium whitespace-nowrap">หมายเหตุ</th>
              <th className="py-3 px-3.5 font-medium text-center whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* 1. เลขที่หนังสือ */}
                <td className="py-3 px-3.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                  {task.id}
                </td>

                {/* 2. รายการ */}
                <td className="py-3 px-3.5 font-medium text-slate-900 min-w-[170px]">
                  {task.title}
                </td>

                {/* 3. ผู้รับผิดชอบหลัก */}
                <td className="py-3 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                  {task.assignee}
                </td>

                {/* 4. ผู้รับผิดชอบแทน */}
                <td className="py-3 px-3.5 text-slate-500 whitespace-nowrap">
                  {task.backupAssignee ? (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      {task.backupAssignee}
                    </span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>

                {/* 5. วันที่รับ / มอบหมาย */}
                <td className="py-3 px-3.5 text-slate-500 whitespace-nowrap font-mono">
                  {task.startDate}
                </td>

                {/* กำหนดส่ง */}
                <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap font-mono font-medium">
                  {task.dueDate}
                </td>

                {/* สถานะ */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  {getStatusBadge(task.status)}
                </td>

                {/* % ความคืบหน้า */}
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          task.status === 'เสร็จสิ้น'
                            ? 'bg-emerald-500'
                            : task.status === 'เกินกำหนด'
                            ? 'bg-rose-500'
                            : task.progress > 50
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-slate-700 tabular-nums font-medium text-[11px]">
                      {task.progress}%
                    </span>
                  </div>
                </td>

                {/* ความสำคัญ */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  {getPriorityBadge(task.priority)}
                </td>

                {/* 6. ขั้นตอนถัดไป / สิ่งที่ต้องทำ */}
                <td className="py-3 px-3.5 text-slate-700 max-w-[180px] truncate" title={task.nextSteps || '-'}>
                  {task.nextSteps ? (
                    <span className="flex items-center gap-1">
                      <ListChecks className="w-3 h-3 text-blue-500 shrink-0" />
                      <span className="truncate">{task.nextSteps}</span>
                    </span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>

                {/* 7. ปัญหา / สิ่งที่ต้องการให้ช่วย */}
                <td className="py-3 px-3.5 max-w-[160px] truncate" title={task.issues || '-'}>
                  {task.issues && task.issues !== '-' && task.issues !== 'ไม่มีปัญหา' ? (
                    <span className="flex items-center gap-1 text-rose-600">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{task.issues}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">{task.issues || '-'}</span>
                  )}
                </td>

                {/* 8. วันที่อัปเดตล่าสุด */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap font-mono text-[11px] text-slate-500">
                  {task.updatedAt || '-'}
                </td>

                {/* 9. ลิงก์ข้อมูล / ผลงาน */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  {task.deliverableLink ? (
                    <a
                      href={task.deliverableLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                      title={task.deliverableLink}
                    >
                      <ExternalLink className="w-3 h-3" />
                      เปิดลิงก์
                    </a>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>

                {/* 10. หมายเหตุ */}
                <td className="py-3 px-3.5 text-slate-500 max-w-[140px] truncate" title={task.notes || '-'}>
                  {task.notes || '-'}
                </td>

                {/* จัดการ (Actions) */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onOpenSendEmailModal?.(task)}
                      className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="ส่งอีเมลแจ้งเตือนงานนี้"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedTasks.length === 0 && (
              <tr>
                <td colSpan={15} className="py-12 text-center text-slate-400">
                  <p className="text-sm">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      handleStatusFilterChange('all');
                    }}
                    className="mt-2 text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredTasks.length > 0 && (
        <div className="p-3 sm:px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            แสดง {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filteredTasks.length)} จาก{' '}
            {filteredTasks.length} รายการ
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
