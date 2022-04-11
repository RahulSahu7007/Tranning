const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');


const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn,viewsController.getTour);
router.get('/login', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm);
router.get('/me', authController.isLoggedIn, viewsController.getAccount);
router.get('/profile', authController.verifyToken, viewsController.profile);
router.get('/verify-email', authController.verifyEmail)

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;