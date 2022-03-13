const express = require('express');
const router = express.Router();

router.use(require('./apiRoutes/departmentRoutes'));
router.use(require('./apiRoutes/employesRoutes'));



module.exports = router;