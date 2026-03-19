import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());

app.use(bodyParser.json({
  type(_request) {
    return true;
  }
}));

app.use((_request, response, next) => {
  response.setHeader('Content-Type', 'application/json');
  next();
});

const notes = [
  {
    "id": 0,
    "content": "First Note"
  },
];
let nextId = 1;

const router = express.Router();

router.get('/notes', (_request, response) => {
  response.send(JSON.stringify(notes));
});

router.post('/notes', (request, response) => {
  notes.push({ ...request.body, id: nextId++ });
  response.status(204).end();
});

router.delete('/notes/:id', (request, response) => {
  const noteId = Number(request.params.id);
  const index = notes.findIndex(n => n.id === noteId);
  if (index !== -1) notes.splice(index, 1);
  response.status(204).end();
});

app.use('/.netlify/functions/server', router);

const lambda = serverless(app);

export async function handler(event, context) {
  return lambda(event, context);
}