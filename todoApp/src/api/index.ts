import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import todos from './todos/todos.routes'

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('todos',todos)

export default router;
