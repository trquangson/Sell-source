const express = require('express');
const router = express.Router();
const forumController = require('../../controllers/client/clientForumController');
const { authenticate, authenticateOptional } = require('../../middlewares/authMiddleware');
const { uploadForumFiles } = require('../../middlewares/uploadMiddleware');
const { contentCreationLimiter } = require('../../middlewares/rateLimitMiddleware');

router.get('/posts', forumController.getPublicPosts);
router.get('/posts/:id', authenticateOptional, forumController.getPostById);
router.post('/posts/:id/view', forumController.incrementView);
router.get('/posts/:id/reviews', forumController.getReviews);

router.use(authenticate);
router.post('/posts', contentCreationLimiter, uploadForumFiles, forumController.createPost);
router.get('/my-posts', forumController.getMyPosts);
router.put('/posts/:id', uploadForumFiles, forumController.updatePost);

router.post('/posts/:id/reviews', contentCreationLimiter, forumController.addReview);

router.delete('/posts/:id', forumController.deletePost);

router.get('/posts/:id/purchase/check', forumController.checkPurchased);
router.post('/posts/:id/purchase', forumController.purchasePost);
router.get('/posts/:id/download', forumController.downloadPost);

module.exports = router;
