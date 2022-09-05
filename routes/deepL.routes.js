const { Router } = require('express');
const router = Router();
const controllers = require('../controllers/deepL.controllers');

router.post('/translate', controllers.deepLTranslate);

module.exports = router;
