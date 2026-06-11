# การออกแบบ Dynamic Prompt สำหรับระบบหลายแผนก (Multi-Department System)

การสร้าง **Dynamic Prompt** คือการนำ "โครงสร้างหลัก (Base Prompt)" มาประกอบร่างกับ "ข้อมูลเฉพาะส่วน (Dynamic Modules)" ตามที่ผู้ใช้เลือก เพื่อส่งให้ AI (เช่น Claude, Cursor, หรือ Manus) สร้างระบบที่ตรงกับความต้องการเป๊ะๆ โดยไม่ทำให้ Prompt ยาวหรือซับซ้อนเกินความจำเป็น

## 🚀 ฉันควรเริ่มต้นอย่างไร?

ในการทำระบบที่มีหลายแผนก (เช่น HR, Sales, Finance) คุณควรแบ่ง Prompt ออกเป็น **3 ชั้น (Layers)** ดังนี้:

### 1. The Core Layer (โครงสร้างพื้นฐาน)
เป็นส่วนที่ **ต้องมีเสมอ** ไม่ว่าผู้ใช้จะเลือกแผนกไหนก็ตาม ประกอบด้วย:
- **Role & Mission:** กำหนดบทบาทของ AI (เช่น "You are an Enterprise Architect")
- **Tech Stack:** กำหนดเทคโนโลยีที่ใช้ (เช่น React, Node.js, PostgreSQL)
- **Global Rules:** กฎเกณฑ์ที่ทุกแผนกต้องใช้ร่วมกัน (เช่น ระบบ Login/JWT, สไตล์การเขียนโค้ด, การวางโครงสร้างโฟลเดอร์)

### 2. The Dynamic Layer (ส่วนที่เปลี่ยนไปตามการเลือก)
เป็นส่วนที่ **จะถูกเติมเข้ามาเมื่อผู้ใช้คลิกเลือกแผนกนั้นๆ** โดยคุณต้องเตรียม "Prompt ย่อย" ของแต่ละแผนกเอาไว้ เช่น:
- **ข้อมูลเฉพาะแผนก:** Table Database ที่แผนกนี้ต้องใช้
- **ฟีเจอร์หลัก:** ฟังก์ชันที่แผนกนี้ต้องมี
- **API Endpoints:** เส้นทาง API ที่จำเป็น

### 3. The Integration Layer (การเชื่อมโยง)
เป็นส่วนที่บังคับให้ AI สร้างจุดเชื่อมต่อระหว่างแผนก (ถ้ามีการเลือกมากกว่า 1 แผนก) เช่น:
- "ให้สร้าง Sidebar ที่เชื่อมไปยังทุกแผนกที่ระบุ"
- "ทุกแผนกต้องอ้างอิง User ID จากระบบ Authentication กลาง"

---

## 🎨 ตัวอย่างการจัดเตรียมข้อมูล (Data Structure) ในแอปของคุณ

คุณสามารถเก็บ Prompt ย่อยไว้ในไฟล์ `constants.js` ของคุณแบบนี้ได้:

\`\`\`javascript
export const DEPARTMENT_PROMPTS = {
  sales: \`
### SALES MODULE REQUIREMENTS
- **Database:** สร้างตาราง \`Deals\` (id, title, amount, stage) และ \`Contacts\`
- **UI Components:** สร้าง Kanban Board สำหรับลากย้าย Deal ตามสถานะ (Prospect, Negotiation, Closed)
- **API:** \`GET /api/sales/deals\`, \`POST /api/sales/deals\`
\`,
  hr: \`
### HR MODULE REQUIREMENTS
- **Database:** สร้างตาราง \`Employees\` (id, name, position, salary) และ \`LeaveRequests\`
- **UI Components:** สร้างตารางแสดงรายชื่อพนักงาน และแบบฟอร์มการขออนุมัติวันหยุด
- **API:** \`GET /api/hr/employees\`, \`POST /api/hr/leave\`
\`
};
\`\`\`

แล้วนำมาต่อกันด้วยโค้ด (เหมือนที่คุณทำใน \`generatePrompt\`)

---

## 📝 โครงสร้างของ Prompt สุดท้ายที่ AI จะได้รับ (Final Rendered Prompt)

เมื่อประกอบร่างเสร็จ Prompt ที่จะถูกคัดลอกไปให้ AI ควรมีหน้าตาแบบนี้:

\`\`\`markdown
# MISSION
You are an Enterprise System Architect. Build a modular web application.

# TECH STACK
- Frontend: React + Tailwind
- Backend: Node.js + Express
- Database: PostgreSQL

# CORE REQUIREMENTS
1. Implement JWT Authentication.
2. Create a unified Sidebar navigation.

# MODULES TO IMPLEMENT
*(ส่วนนี้คือ Dynamic Layer ที่เปลี่ยนไปตามการเลือก)*

### SALES MODULE
- Database: \`Deals\` and \`Contacts\` table
- UI: Kanban Board for Deals tracking
- API: \`GET\` and \`POST\` for \`/api/sales/deals\`

### HR MODULE
- Database: \`Employees\` and \`LeaveRequests\` table
- UI: Employee Data Table and Leave Request Form
- API: \`GET\` and \`POST\` for \`/api/hr/employees\`

# EXECUTION
Generate the code file by file starting from the backend schema.
\`\`\`

---

## 💡 สรุปแนวคิด
แทนที่คุณจะส่งคำสั่งว่า *"สร้างระบบให้หน่อย มีแผนก HR กับ Sales"* การทำ Dynamic Prompt ที่ดี คือการส่งคำสั่งว่า *"สร้างระบบให้หน่อย โดยระบบ HR ต้องมีหน้าตาแบบนี้ มีตารางฐานข้อมูลแบบนี้ และระบบ Sales ต้องมีหน้าตาแบบนี้"* 

การเตรียม Prompt ย่อยๆ แยกไว้แต่ละแผนก จะช่วยให้คุณคุมคุณภาพของโค้ดที่ AI สร้างขึ้นมาได้ดีขึ้นอย่างมหาศาลครับ!
