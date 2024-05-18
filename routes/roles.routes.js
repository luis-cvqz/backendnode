const router = require('express')
const router = require('../controllers/roles.controller')

// GET: api/auth
router.get('/', roles.getAll)

module.exports = router