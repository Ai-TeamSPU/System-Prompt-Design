const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const pool = require('./db');

// Initialize Database Table
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usecases (
                id VARCHAR(100) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                image LONGTEXT,
                date DATETIME NOT NULL
            )
        `);
        console.log('Database connected and table ready.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDB();

// Endpoint to get all usecases
app.get('/api/usecases', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usecases ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        console.error('Failed to fetch usecases', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Endpoint to get form options from database
app.get('/api/form-options', async (req, res) => {
    try {
        const [tools] = await pool.query('SELECT * FROM tools');
        const [promptBases] = await pool.query('SELECT * FROM prompt_bases');
        const [departments] = await pool.query('SELECT * FROM departments');
        
        res.json({
            tools,
            promptBase: promptBases.map(row => ({
                id: row.id,
                name: row.name,
                desc: row.description,
                promptTemplate: row.prompt_template
            })),
            departments: departments.map(row => ({
                id: row.id,
                name: row.name,
                desc: row.description
            }))
        });
    } catch (err) {
        console.error('Failed to fetch form options', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Endpoint to create a new usecase
app.post('/api/usecases', async (req, res) => {
    const { title, description, image } = req.body;
    
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const newUsecase = {
        id: 'uc-' + Date.now(),
        title,
        description,
        image: image || null, // Base64 string
        date: new Date().toISOString().slice(0, 19).replace('T', ' ') // Format for MySQL DATETIME
    };
    
    try {
        await pool.query(
            'INSERT INTO usecases (id, title, description, image, date) VALUES (?, ?, ?, ?, ?)',
            [newUsecase.id, newUsecase.title, newUsecase.description, newUsecase.image, newUsecase.date]
        );
        res.status(201).json(newUsecase);
    } catch (err) {
        console.error('Failed to insert usecase', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Options for dropdowns
const aiModels = [
    { id: 'chatgpt', name: 'ChatGPT' },
    { id: 'claude', name: 'Claude' },
    { id: 'gemini', name: 'Gemini' },
    { id: 'copilot', name: 'GitHub Copilot' }
];

const departments = [
    { id: 'it', name: 'Information Technology (IT)' },
    { id: 'hr', name: 'Human Resources (HR)' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'finance', name: 'Finance' },
    { id: 'operations', name: 'Operations' }
];

// Endpoint to get form options
app.get('/api/options', (req, res) => {
    res.json({ aiModels, departments });
});

// Endpoint to generate the prompt
app.post('/api/generate-prompt', (req, res) => {
    const { aiModelId, departmentId, projectContext } = req.body;

    if (!aiModelId || !departmentId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const aiModel = aiModels.find(ai => ai.id === aiModelId);
    const department = departments.find(d => d.id === departmentId);

    if (!aiModel || !department) {
        return res.status(400).json({ error: 'Invalid AI model or department' });
    }

    const promptTemplate = `
You are an expert system designer and software architect acting on behalf of the ${department.name} department. 
Your task is to design a comprehensive website system architecture using the ${aiModel.name} AI model's best practices.

Project Context / Requirements:
${projectContext ? projectContext : "No specific context provided. Please propose a general system architecture for this department's typical needs."}

Please provide:
1. High-level System Architecture
2. Recommended Tech Stack
3. Core Features & Modules
4. Security & Compliance Considerations (especially for ${department.name})
5. Deployment Strategy
`.trim();

    res.json({ prompt: promptTemplate });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
