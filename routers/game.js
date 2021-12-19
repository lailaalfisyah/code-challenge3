const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController')

router.get('/', gameController.loginPage)
router.post('/', gameController.loginProcess)

module.exports = router