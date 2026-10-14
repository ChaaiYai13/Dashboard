export type TaskStatus =
  | 'เสร็จสิ้น'
  | 'กำลังดำเนินการ'
  | 'รอดำเนินการ'
  | 'เกินกำหนด'
  | 'ยังไม่เริ่ม'
  | 'ยกเลิก';

export type TaskPriority = 'สูง' | 'ปานกลาง' | 'ต่ำ';

export interface Task {
  id: string; // เลขที่หนังสือ (e.g. อว 0601/ว 1001 หรือ DOC-001)
  title: string; // รายการ
  project?: string;
  assignee: string; // ผู้รับผิดชอบหลัก (e.g. จันทิมา, สิงหา)
  assigneeEmail: string;
  backupAssignee?: string; // ผู้รับผิดชอบแทน (e.g. ศิริวัฒน์, เบญจวรรณ)
  backupAssigneeEmail?: string;
  startDate: string; // วันที่รับ / มอบหมาย (e.g. 8 ต.ค. 69)
  dueDate: string; // กำหนดส่ง (e.g. 15 ต.ค. 69)
  status: TaskStatus;
  progress: number; // 0 to 100
  priority: TaskPriority;
  nextSteps?: string; // ขั้นตอนถัดไป / สิ่งที่ต้องทำ
  issues?: string; // ปัญหา / สิ่งที่ต้องการให้ช่วย
  updatedAt?: string; // วันที่อัปเดตล่าสุด
  deliverableLink?: string; // ลิงก์ข้อมูล / ผลงาน
  notes?: string; // หมายเหตุ
  overdueDays?: number;
  category?: string;
}

export interface ProjectSummary {
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export interface AssigneeSummary {
  name: string;
  count: number;
  color: string;
  email: string;
  role: string;
}

export type ViewTab = 'dashboard' | 'tasks' | 'add' | 'reports' | 'notifications' | 'settings';

export interface PriorityNotificationRule {
  priority: TaskPriority;
  enabled: boolean;
  daysBeforeDue: number[];
  alertOnDueDate: boolean;
  alertOnOverdue: boolean;
  overdueFrequency: 'daily' | 'every2days' | 'once';
  channels: {
    email: boolean;
    inApp: boolean;
    lineNotify: boolean;
  };
  emailSubjectTemplate: string;
}

export interface NotificationItem {
  id: string;
  taskId: string;
  taskTitle: string;
  assignee: string;
  assigneeEmail: string;
  priority: TaskPriority;
  type: 'overdue' | 'due_today' | 'upcoming' | 'assigned';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  channel: 'email' | 'inApp' | 'line';
}

export interface NotificationLog {
  id: string;
  taskId: string;
  taskTitle: string;
  recipient: string;
  priority: TaskPriority;
  triggerType: string;
  channel: string;
  sentAt: string;
  status: 'สำเร็จ' | 'รอดำเนินการ' | 'ล้มเหลว';
}
