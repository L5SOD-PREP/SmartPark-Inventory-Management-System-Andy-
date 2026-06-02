const router = require('express').Router();
const authenticate = require('../middleware/auth');
const { register, login, setSecurityQuestions, getSecurityQuestions, verifyAndResetPassword } = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.put('/questions', authenticate, setSecurityQuestions);
router.post('/get-security-questions', getSecurityQuestions);
router.post('/verify-and-reset-password', verifyAndResetPassword);

module.exports = router;
