const express = require('express');
const router = express.Router();
const aiController = require('../controllers/AiController.js');

router.route('/prompt')
.post((req, res) => aiController.prompt(req, res))

router.route('/longContext')
.post((req, res) => aiController.longContext(req, res))

module.exports = router;