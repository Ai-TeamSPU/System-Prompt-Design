const mysql = require('mysql2/promise');
require('dotenv').config();

const INGREDIENTS = {
  tools: [
    { id: 'manus', name: 'Manus — React, Node.js, PostgreSQL' },
    { id: 'cursor', name: 'Cursor — Fullstack generation' },
    { id: 'chatgpt', name: 'ChatGPT — Concept & Logic' },
    { id: 'claude', name: 'Claude — Architecture Design' }
  ],
  promptBase: [
    {
      id: 'startup',
      name: 'Startup',
      desc: 'สำหรับการสร้างระบบที่ยืดหยุ่น ขยายตัวไว พร้อมรับการเติบโตแบบก้าวกระโดด',
      promptTemplate: `# Startup Organization Website System Base Prompt\n\nYou are a Senior Fullstack Developer, Startup System Architect, Backend Engineer, Frontend Engineer, UI/UX Designer, Database Architect, DevOps Engineer, and Prompt Engineer.\n\nYour task is to design and generate a production-ready startup organization management web application.\n\nThe system must be modular, scalable, maintainable, and optimized for startup environments with fast MVP development and future scalability.\n\nOrganization Size:\nStartup\n\nDepartments:\n[.]`
    },
    {
      id: 'sme',
      name: 'SME',
      desc: 'สำหรับการสร้างระบบบริหารจัดการขององค์กรขนาดเล็ก',
      promptTemplate: `[ใส่ Prompt ของ SME ตรงนี้]\nDepartments:\n[.]`
    },
    {
      id: 'mid-market',
      name: 'Mid-Market',
      desc: 'สำหรับการสร้างระบบที่เชื่อมโยงทุกแผนก รองรับธุรกิจที่ซับซ้อนขึ้น',
      promptTemplate: `[ใส่ Prompt ของ Mid-Market ตรงนี้]\nDepartments:\n[.]`
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      desc: 'สำหรับการสร้างระบบขนาดใหญ่ เน้นความปลอดภัยสูง และรองรับข้อมูลมหาศาล',
      promptTemplate: `[ใส่ Prompt ของ Enterprise ตรงนี้]\nDepartments:\n[.]`
    }
  ],
  departments: [
    { id: 'management', name: 'แผนกบริหาร (Management)', desc: 'กำหนดทิศทาง กลยุทธ์ และดูแลภาพรวมองค์กร' },
    { id: 'hr', name: 'ฝ่ายทรัพยากรบุคคล (HR)', desc: 'สรรหาบุคลากร ดูแลสวัสดิการ ฝึกอบรม' },
    { id: 'finance', name: 'ฝ่ายการเงินและบัญชี (Finance)', desc: 'บริหารงบประมาณ รายรับ-รายจ่าย ภาษี' },
    { id: 'marketing', name: 'ฝ่ายการตลาด (Marketing)', desc: 'วางกลยุทธ์แบรนด์ โฆษณา วิเคราะห์ลูกค้า' },
    { id: 'sales', name: 'ฝ่ายขาย (Sales)', desc: 'นำเสนอสินค้า ปิดการขาย สร้างรายได้' },
    { id: 'operations', name: 'ฝ่ายปฏิบัติการ (Operations)', desc: 'ดูแลระบบการทำงาน ควบคุมการผลิต' },
    { id: 'it', name: 'ฝ่ายไอที (IT)', desc: 'ดูแลระบบคอมพิวเตอร์ เครือข่าย ความปลอดภัย' }
  ]
};

async function seed() {
    console.log("Connecting to the database...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'vibe_prompt_db',
        port: process.env.DB_PORT || 4306
    });

    console.log("Creating tables...");
    
    await connection.query('DROP TABLE IF EXISTS tools');
    await connection.query(`
        CREATE TABLE tools (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(200) NOT NULL
        )
    `);

    await connection.query('DROP TABLE IF EXISTS prompt_bases');
    await connection.query(`
        CREATE TABLE prompt_bases (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            prompt_template TEXT NOT NULL
        )
    `);

    await connection.query('DROP TABLE IF EXISTS departments');
    await connection.query(`
        CREATE TABLE departments (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            description TEXT NOT NULL
        )
    `);

    console.log("Inserting data into 'tools'...");
    for (const tool of INGREDIENTS.tools) {
        await connection.query('INSERT INTO tools (id, name) VALUES (?, ?)', [tool.id, tool.name]);
    }

    console.log("Inserting data into 'prompt_bases'...");
    for (const base of INGREDIENTS.promptBase) {
        await connection.query('INSERT INTO prompt_bases (id, name, description, prompt_template) VALUES (?, ?, ?, ?)', 
        [base.id, base.name, base.desc, base.promptTemplate]);
    }

    console.log("Inserting data into 'departments'...");
    for (const dept of INGREDIENTS.departments) {
        await connection.query('INSERT INTO departments (id, name, description) VALUES (?, ?, ?)', 
        [dept.id, dept.name, dept.desc]);
    }

    console.log("Seeding complete! Closing connection.");
    await connection.end();
}

seed().catch(err => {
    console.error("Failed to seed database:", err);
    process.exit(1);
});
