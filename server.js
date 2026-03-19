import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let notes = [
  { id: "0", content: "First Note" }
];
let nextId = 1;


app.get('/notes', (_req, res) => {
  console.log('📥 GET /notes');
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const { content } = req.body;
  console.log('📥 POST /notes:', content);
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const newNote = {
    id: String(nextId++),
    content
  };
  notes.push(newNote);
  
  res.status(201).json(newNote);
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  console.log('📥 DELETE /notes/', id);
  
  const index = notes.findIndex(note => note.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }
  
  notes.splice(index, 1);
  res.json({ message: 'Deleted', id });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    notesCount: notes.length,
    timestamp: new Date().toISOString()
  });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Notes: http://localhost:${PORT}/notes`);
});


process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});