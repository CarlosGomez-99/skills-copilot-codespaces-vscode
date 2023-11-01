// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// Get all comments for a given post
const handleEvent = (type, data) => {
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const comments = posts[postId] || [];
    comments.push({ id, content, status });
    posts[postId] = comments;
  } else if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const comments = posts[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

// Get all comments for a given post
app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const comments = posts[id] || [];
  res.status(200).send(comments);
});

// Create a new comment for a given post
app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comments = posts[id] || [];

  const comment = {
    id: Math.floor(Math.random() * 999999999999),
    content,
    status: 'pending',
  };
  comments.push(comment);

  posts[id] = comments;

  // Emit event to event-bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { ...comment, postId: id },
  });

  res.status(201).send(comments);
});

// Recieve events from event-bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  res.status(200).send({ status: 'OK' });
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});