import { PriorityNotificationRule, NotificationItem, Task } from '../types';

export const DEFAULT_PRIORITY_RULES: Record<string, PriorityNotificationRule> = {
  'สูง': {
    priority: 'สูง',
    enabled: true,
    daysBeforeDue: [7, 3, 1],
    alertOnDueDate: true,
    alertOnOverdue: true,
    overdueFrequency: 'daily',
    channels: {
      email: true,
      inApp: true,
      lineNotify: true,
    },
    emailSubjectTemplate: '[ด่วนที่สุด - ระดับสูง] หนังสือใกล้ครบกำหนด: {taskTitle} ({taskId})',
  },
  'ปานกลาง': {
    priority: 'ปานกลาง',
    enabled: true,
    daysBeforeDue: [3, 1],
    alertOnDueDate: true,
    alertOnOverdue: true,
    overdueFrequency: 'every2days',
    channels: {
      email: true,
      inApp: true,
      lineNotify: false,
    },
    emailSubjectTemplate: '[แจ้งเตือน] หนังสือใกล้ครบกำหนดส่ง: {taskTitle} ({taskId})',
  },
  'ต่ำ': {
    priority: 'ต่ำ',
    enabled: true,
    daysBeforeDue: [1],
    alertOnDueDate: true,
    alertOnOverdue: true,
    overdueFrequency: 'once',
    channels: {
      email: false,
      inApp: true,
      lineNotify: false,
    },
    emailSubjectTemplate: '[เตือนความจำ] รายการที่ต้องส่งมอบ: {taskTitle} ({taskId})',
  },
};

// Generate realistic in-app notifications from the current tasks
export function generateNotificationsFromTasks(tasks: Task[]): NotificationItem[] {
  const notifications: NotificationItem[] = [];

  // Overdue notifications
  const overdueTasks = tasks.filter((t) => t.status === 'เกินกำหนด');
  overdueTasks.slice(0, 5).forEach((task, idx) => {
    notifications.push({
      id: `NOTIF-OD-${task.id}`,
      taskId: task.id,
      taskTitle: task.title,
      assignee: task.assignee,
      assigneeEmail: task.assigneeEmail,
      priority: task.priority,
      type: 'overdue',
      title: `หนังสือเกินกำหนด ${task.overdueDays || 2} วัน`,
      message: `หนังสือ "${task.id}: ${task.title}" กำหนดส่งเมื่อ ${task.dueDate} เกินกำหนดแล้ว กรุณาเร่งรัดและรายงานผล`,
      timestamp: `${idx + 1} ชม. ที่แล้ว`,
      read: idx > 1,
      channel: task.priority === 'สูง' ? 'line' : 'email',
    });
  });

  // Upcoming notifications (in progress tasks)
  const upcomingHigh = tasks.filter((t) => t.priority === 'สูง' && t.status === 'กำลังดำเนินการ');
  upcomingHigh.slice(0, 3).forEach((task, idx) => {
    notifications.push({
      id: `NOTIF-UP-${task.id}`,
      taskId: task.id,
      taskTitle: task.title,
      assignee: task.assignee,
      assigneeEmail: task.assigneeEmail,
      priority: task.priority,
      type: 'upcoming',
      title: 'หนังสือความสำคัญสูง ใกล้ครบกำหนดใน 3 วัน',
      message: `รายการ "${task.id}: ${task.title}" กำหนดส่ง ${task.dueDate} (ความคืบหน้าปัจจุบัน ${task.progress}%)`,
      timestamp: `${idx + 4} ชม. ที่แล้ว`,
      read: false,
      channel: 'email',
    });
  });

  // Due today / normal tasks
  const normalUpcoming = tasks.filter((t) => t.priority === 'ปานกลาง' && t.status === 'กำลังดำเนินการ');
  normalUpcoming.slice(0, 2).forEach((task, idx) => {
    notifications.push({
      id: `NOTIF-MID-${task.id}`,
      taskId: task.id,
      taskTitle: task.title,
      assignee: task.assignee,
      assigneeEmail: task.assigneeEmail,
      priority: task.priority,
      type: 'due_today',
      title: 'แจ้งเตือนกำหนดส่งมอบตามแผนงาน',
      message: `รายการ "${task.id}: ${task.title}" ใกล้ถึงกำหนดส่ง ${task.dueDate}`,
      timestamp: 'เมื่อวานนี้ 09:00 น.',
      read: true,
      channel: 'inApp',
    });
  });

  return notifications;
}
