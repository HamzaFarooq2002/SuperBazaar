const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;
  const query = { user: req.user.id };
  const [items, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(query)
  ]);
  res.json({ success: true, data: { notifications: items, pagination: { page, limit, total } } });
});

router.get('/unread-count', async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user.id, isRead: false });
  res.json({ success: true, data: { unreadCount: count } });
});

router.patch('/:id/read', async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { isRead: true });
  res.json({ success: true, message: 'Notification marked as read' });
});

router.patch('/read-all', async (req, res) => {
  await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'Notifications marked as read' });
});

module.exports = router;
