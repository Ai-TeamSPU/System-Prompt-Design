// Global PROMPT_BASE is removed. Each company size now has its own promptTemplate.

export const INGREDIENTS = {
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
      promptTemplate: `# Startup Organization Website System Base Prompt

You are a Senior Fullstack Developer, Startup System Architect, Backend Engineer, Frontend Engineer, UI/UX Designer, Database Architect, DevOps Engineer, and Prompt Engineer.

Your task is to design and generate a production-ready startup organization management web application.

The system must be modular, scalable, maintainable, and optimized for startup environments with fast MVP development and future scalability.

Organization Size:
Startup

Departments:
[DEPARTMENTS]

Build a lightweight modular management platform for startup organizations that supports:

* multiple departments
* department-based access control
* modular expansion
* centralized management
* dashboard analytics
* scalable architecture
* rapid MVP deployment

The system must allow adding or removing departments in the future without major refactoring.

Use a SIMPLE MODULAR MONOLITH architecture optimized for startup environments.

Requirements:

* Monolithic backend architecture
* Modular folder structure
* Department-based modules
* Shared reusable components
* Shared service layer
* Centralized authentication
* REST API architecture
* Responsive admin dashboard

Architecture priorities:

* Simplicity
* Speed of development
* Easy deployment
* Maintainability
* Low infrastructure cost
* Future scalability

Frontend:

* React + Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios
* Context API
* Recharts

Backend:

* Node.js
* Express.js
* REST API
* JWT Authentication

Database:

* PostgreSQL
* Prisma ORM

Deployment:

* Docker Compose
* Nginx

Authentication:

* Login
* Logout
* JWT Authentication
* Password Hashing

RBAC:

* Admin
* Manager
* Staff

Department Management:

* Create Department
* Edit Department
* Delete Department
* Department-based users
* Department dashboards

Dashboard:

* Overview analytics
* Charts and reports
* Activity summaries
* Department statistics

User Management:

* Create users
* Assign departments
* Assign roles
* Manage permissions

System Features:

* Responsive admin panel
* Dynamic sidebar navigation
* Dynamic routing
* Activity logs
* Notifications
* Search and filtering

Design a relational PostgreSQL database schema supporting:

* Users
* Roles
* Permissions
* Departments
* Department Modules
* Activity Logs

Requirements:

* Prisma ORM schema
* Migration-ready setup
* Relational integrity
* Scalable structure

Generate REST APIs for:

* Authentication
* Users
* Departments
* Roles
* Permissions
* Dashboard Analytics
* Activity Logs

Include:

* JWT middleware
* Validation middleware
* Error handling middleware
* Role checking middleware

Design a modern startup-style admin dashboard UI with:

* Clean minimal interface
* Mobile responsive design
* Sidebar navigation
* Dashboard cards
* Charts and analytics
* Tables
* Forms
* Notification components

Use:

* Tailwind CSS
* Recharts

Generate:

* Docker Compose setup
* Nginx configuration
* Production-ready environment setup
* .env.example
* README.md
* Deployment guide

Generate:

* frontend source code
* backend source code
* folder structure
* Prisma schema
* REST APIs
* middleware
* authentication system
* RBAC system
* dashboard UI
* charts
* tables
* Docker setup
* README.md

Generate project in file-by-file format:

/backend/src/server.js

\`\`\`js
code...
\`\`\`

/frontend/src/App.jsx

\`\`\`jsx
code...
\`\`\`

Also generate:

1. Folder Structure
2. Architecture Explanation
3. Database ERD Description
4. API Documentation
5. RBAC Matrix
6. Deployment Workflow
7. Scalability Recommendations
8. Future Upgrade Path to SME Architecture`
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
