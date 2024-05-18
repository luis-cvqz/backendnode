const router = require('express').Router()
const usuarios = require('../controllers/usuarios.controller')

// GET: api/usuarios
router.get('/', usuarios.getAll)

// GET: api/usuarios/email
router.get('/:email', usuarios.get)

// POST: api/usuarios/
router.post('/', usuarios.create)

// PUT: api/usuarios/email
router.put('/:email', usuarios.update)

// DELETE: api/usuarios/email
router.delete('/:email', usuarios.delete)

module.exports = router