export const APPS_SCRIPT_CODE = `/**
 * Google Apps Script สำหรับระบบติดตามหนังสือและภารกิจ (Document & Task Tracking System)
 * ปรับแต่งตามโครงสร้างข้อมูลหนังสือราชการและภารกิจองค์กร
 * องค์กร: สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)
 * 
 * โครงสร้างคอลัมน์ใน Google Sheets:
 * A: เลขที่หนังสือ
 * B: รายการ
 * C: โครงการ / หมวดหมู่
 * D: ผู้รับผิดชอบหลัก
 * E: อีเมลผู้รับผิดชอบหลัก
 * F: ผู้รับผิดชอบแทน
 * G: วันที่รับ / มอบหมาย
 * H: กำหนดส่ง
 * I: สถานะ
 * J: % ความคืบหน้า
 * K: ความสำคัญ
 * L: ขั้นตอนถัดไป / สิ่งที่ต้องทำ
 * M: ปัญหา / สิ่งที่ต้องการให้ช่วย
 * N: วันที่อัปเดตล่าสุด
 * O: ลิงก์ข้อมูล / ผลงาน
 * P: หมายเหตุ
 */

const SHEET_NAME = 'งานทั้งหมด';
const SENDER_NAME = 'ระบบติดตามหนังสือและภารกิจ (GISTDA)';

const NOTIFICATION_RULES = {
  'สูง': {
    daysBefore: [7, 3, 1],
    escalateOverdueDaily: true,
    subjectPrefix: '[ด่วนที่สุด - ระดับสูง]',
    headerColor: '#DC2626'
  },
  'ปานกลาง': {
    daysBefore: [3, 1],
    escalateOverdueDaily: false,
    subjectPrefix: '[แจ้งเตือน]',
    headerColor: '#2563EB'
  },
  'ต่ำ': {
    daysBefore: [1],
    escalateOverdueDaily: false,
    subjectPrefix: '[เตือนความจำ]',
    headerColor: '#16A34A'
  }
};

/**
 * ฟังก์ชันตั้งค่าเริ่มต้นและสร้าง Trigger รายวัน (ทุกวันเวลา 08:30 น.)
 */
function initialSetup() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  ScriptApp.newTrigger('checkAndSendDailyReminders')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  Logger.log('ตั้งค่า Trigger ตรวจสอบหนังสือและภารกิจรายวันเรียบร้อยแล้ว');
}

/**
 * ฟังก์ชันตรวจเช็กหนังสือใกล้ครบกำหนดและส่งอีเมลแจ้งเตือน
 */
function checkAndSendDailyReminders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const docNumber = row[0];       // เลขที่หนังสือ
    const title = row[1];           // รายการ
    const assignee = row[3];        // ผู้รับผิดชอบหลัก
    const email = row[4] || 'singha@gistda.or.th';
    const backupAssignee = row[5];  // ผู้รับผิดชอบแทน
    const dueDate = new Date(row[7]);
    const status = row[8];
    const progress = row[9];
    const priority = row[10] || 'ปานกลาง';
    const nextSteps = row[11] || '-';
    const issues = row[12] || '-';

    if (status === 'เสร็จสิ้น' || status === 'ยกเลิก') continue;

    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const rule = NOTIFICATION_RULES[priority] || NOTIFICATION_RULES['ปานกลาง'];
    let shouldSend = false;
    let headline = '';
    let subject = '';
    let color = rule.headerColor;

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      if (rule.escalateOverdueDaily || overdueDays % 2 === 1) {
        shouldSend = true;
        subject = \`\${rule.subjectPrefix} หนังสือเกินกำหนด \${overdueDays} วัน - \${title} (\${docNumber})\`;
        headline = \`หนังสือเลขที่ \${docNumber} เกินกำหนดส่งมอบมาแล้ว \${overdueDays} วัน\`;
        color = '#DC2626';
      }
    } else if (diffDays === 0) {
      shouldSend = true;
      subject = \`\${rule.subjectPrefix} หนังสือครบกำหนดส่งวันนี้ - \${title} (\${docNumber})\`;
      headline = \`หนังสือเลขที่ \${docNumber} ครบกำหนดส่งมอบภายในวันนี้\`;
      color = '#EA580C';
    } else if (rule.daysBefore.includes(diffDays)) {
      shouldSend = true;
      subject = \`\${rule.subjectPrefix} หนังสือใกล้ครบกำหนดในอีก \${diffDays} วัน - \${title} (\${docNumber})\`;
      headline = \`มีรายการหนังสือที่ใกล้ครบกำหนดในอีก \${diffDays} วัน\`;
    }

    if (shouldSend && email) {
      sendEmailAlert(email, assignee, backupAssignee, docNumber, title, row[7], progress, priority, nextSteps, issues, headline, subject, color);
    }
  }
}

/**
 * ฟังก์ชันส่งอีเมล HTML ดีไซน์สวยงาม
 */
function sendEmailAlert(email, assignee, backupAssignee, docNumber, title, dueDateStr, progress, priority, nextSteps, issues, headline, subject, color) {
  const htmlBody = \`
    <div style="font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: \${color}; padding: 20px 24px; color: white;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">ระบบติดตามหนังสือและภารกิจ</h2>
        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.95;">สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)</p>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 15px; color: #1e293b; margin-top: 0;">เรียน คุณ\${assignee} (ผู้รับผิดชอบหลัก),</p>
        <div style="background-color: #f8fafc; border-left: 4px solid \${color}; padding: 14px 18px; border-radius: 4px; margin: 16px 0;">
          <p style="font-size: 14px; font-weight: 600; color: \${color}; margin: 0;">\${headline}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: 600; width: 140px;">เลขที่หนังสือ:</td>
            <td style="padding: 8px 0; font-family: monospace; font-weight: 600;">\${docNumber}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: 600;">รายการ:</td>
            <td style="padding: 8px 0;">\${title}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: 600;">ผู้รับผิดชอบแทน:</td>
            <td style="padding: 8px 0;">\${backupAssignee || '-'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: 600;">กำหนดส่ง:</td>
            <td style="padding: 8px 0; color: #b91c1c; font-weight: 600;">\${dueDateStr}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: 600;">ความคืบหน้า:</td>
            <td style="padding: 8px 0;">\${progress}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 8px 0; font-weight: 600;">ขั้นตอนถัดไป:</td>
            <td style="padding: 8px 0; color: #2563EB;">\${nextSteps}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">ปัญหา/อุปสรรค:</td>
            <td style="padding: 8px 0; color: #DC2626;">\${issues}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 12px; color: #64748b;">
        ระบบติดตามหนังสือและภารกิจ สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (GISTDA)
      </div>
    </div>
  \`;

  GmailApp.sendEmail(email, subject, 'กรุณาเปิดด้วยอีเมลไคลเอนต์ที่รองรับ HTML', {
    htmlBody: htmlBody,
    name: SENDER_NAME,
  });
}
`;
