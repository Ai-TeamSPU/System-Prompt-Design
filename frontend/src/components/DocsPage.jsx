import React from 'react';
import { BookOpen, Layers, Move, Sparkles } from 'lucide-react';

const DocsPage = () => {
  return (
    <div className="usecases-page" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="usecases-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <BookOpen color="var(--primary-accent)" size={36} />
          คู่มือการใช้งาน Vibe Prompt Builder
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          ยินดีต้อนรับสู่ Vibe Prompt Builder เครื่องมือที่จะช่วยให้คุณสร้าง System Prompt สำหรับ AI ได้อย่างมืออาชีพ รวดเร็ว และแม่นยำ ด้วยระบบแบบ Drag & Drop (ลากแล้ววาง)
          <br /><br />
          หน้านี้จะอธิบายวิธีการทำงานและแนวคิดในการสร้าง Prompt ของระบบเรา เพื่อให้คุณสามารถดึงศักยภาพสูงสุดของ AI ออกมาใช้งานได้
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)' }}>
          <Layers /> แนวคิดแบบ "Vibe Prompt Layering"
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          การเขียน Prompt ที่ดี ไม่ใช่แค่การพิมพ์ข้อความยาวๆ แต่คือการ <strong>"จัดโครงสร้างและบริบท"</strong> ให้ AI เข้าใจบทบาทและเป้าหมายอย่างชัดเจน ระบบของเราใช้แนวคิดการแบ่งเลเยอร์ (Layering) ออกเป็น 3 ชั้น ดังนี้:
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li style={{ lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>1. 🤖 AI Agent (กำหนดตัวตนและสมอง):</strong> เลเยอร์แรกคือการเลือก "สมอง" หรือ AI Model ที่เหมาะสมกับงาน (เช่น GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) AI แต่ละตัวมีความถนัดและสไตล์การตอบคำถามที่ต่างกัน การระบุ Agent ที่ชัดเจนจะช่วยกำหนดทิศทางเบื้องต้นของผลลัพธ์
          </li>
          <li style={{ lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>2. 🏢 Company Size / Context (กำหนดบริบทของธุรกิจ):</strong> เลเยอร์ที่สองคือ "บริบทขององค์กร" (เช่น Startup, SME, Enterprise) ขนาดขององค์กรมีผลต่อทรัพยากร งบประมาณ และวิธีการแก้ปัญหา การบอก AI ว่าเราอยู่ในองค์กรขนาดไหน จะทำให้คำแนะนำที่ได้นั้นนำไปปฏิบัติจริงได้ (Actionable) และตรงกับความเป็นจริงมากขึ้น
          </li>
          <li style={{ lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>3. 💼 Departments (กำหนดฝ่าย/ผู้เชี่ยวชาญเฉพาะทาง):</strong> เลเยอร์สุดท้ายคือ "ความเชี่ยวชาญ" (เช่น Marketing, HR, Engineering) การเลือกแผนกจะเป็นการกำหนด Role ให้ AI สวมบทบาทเป็นผู้เชี่ยวชาญในสายงานนั้นๆ เพื่อให้ได้คำศัพท์เฉพาะทาง (Jargon) และมุมมองการแก้ปัญหาที่ตรงจุดที่สุด
          </li>
        </ul>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)' }}>
          <Move /> วิธีการใช้งาน (Drag & Drop)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          ระบบของเราออกแบบมาให้ใช้งานง่ายที่สุดโดยไม่ต้องเขียนโค้ด เพียงแค่ <strong>"ลากและวาง"</strong> คุณก็จะได้ System Prompt ที่สมบูรณ์
        </p>

        {/* Video / GIF Placeholder */}
        <div style={{ 
          background: 'rgba(0,0,0,0.5)', 
          border: '2px dashed var(--glass-border)', 
          borderRadius: '12px', 
          padding: '3rem', 
          textAlign: 'center',
          color: 'var(--text-secondary)',
          margin: '1rem 0'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>[พื้นที่สำหรับใส่ภาพ GIF หรือ วิดีโอสาธิตการลากวาง]</p>
          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>(รอนำไฟล์ .gif หรือ .mp4 มาใส่ตรงนี้เพื่อความสมบูรณ์)</span>
        </div>

        <h3 style={{ color: 'var(--text-primary)', marginTop: '1rem' }}>ขั้นตอนการสร้าง Prompt:</h3>
        <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li><strong>เลือกเมนูด้านซ้าย (Sidebar):</strong> คลิกเลือกหมวดหมู่ที่ต้องการ (AI Agent, Company Size, Departments)</li>
          <li><strong>ลาก (Drag):</strong> คลิกค้างที่การ์ดตัวเลือกที่คุณต้องการ (เช่น "Claude 3.5 Sonnet" หรือ "Marketing")</li>
          <li><strong>วาง (Drop):</strong> ลากมาวางในช่องพื้นที่ตรงกลางหน้าจอ (Cup Preview)</li>
          <li><strong>ทำซ้ำ:</strong> เลือกลากองค์ประกอบต่างๆ ให้ครบทั้ง 3 เลเยอร์ เพื่อความสมบูรณ์</li>
          <li><strong>ดูผลลัพธ์ & คัดลอก:</strong> ทันทีที่คุณวางครบ ระบบจะทำการ Generate Prompt ให้ทางด้านขวา คุณสามารถกดปุ่ม "Clone Prompt" หรือ "คัดลอก" เพื่อนำไปใช้งานใน AI Platform ของคุณได้ทันที!</li>
        </ol>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-accent)' }}>
          <Sparkles /> เคล็ดลับเพิ่มเติม
        </h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li style={{ lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Clear Selection:</strong> หากคุณเลือกลากผิด หรือต้องการเปลี่ยนหัวข้อ สามารถกดปุ่ม <strong>"ล้างตัวเลือก" (Clear)</strong> ด้านล่างแก้วกาแฟได้ตลอดเวลา
          </li>
          <li style={{ lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Prompt Feed & History:</strong> คุณสามารถเข้าไปดูไอเดีย Prompt ของคนอื่นๆ ในเมนู <code>Popular</code> และ <code>History</code> เพื่อนำมาเป็นแบบอย่าง หรือกดปุ่ม Clone เพื่อนำมาดัดแปลงเป็นของตัวเองได้
          </li>
          <li style={{ lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Share Usecase:</strong> หากคุณสร้าง Prompt ที่ทำงานได้ดีเยี่ยม อย่าลืมกด <strong>"Add Prompt Usecase"</strong> เพื่อแชร์ให้ทีมหรือคอมมูนิตี้ได้นำไปใช้งานต่อ!
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocsPage;
