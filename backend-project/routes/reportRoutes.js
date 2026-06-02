const router = require('express').Router();
const ctrl = require('../controller/reportController');
const auth = require('../middleware/auth');

router.get('/stock-status', auth, ctrl.stockStatus);
router.get('/stock-report', auth, ctrl.stockReport);
router.get('/low-stock', auth, ctrl.lowStockAlert);

module.exports = router;
