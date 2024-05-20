const bcrypt = require('bcrypt')
const { usuario, rol, Squelize, Sequelize } = require('../models')
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service')
const { where } = require('sequelize')
const { raw } = require('mysql2')

let self = {}

// POST: api/auth
self.login = async function (req, res) {
    try {
        let mail = req.body.email
        let password = req.body.password

        let data = await usuario.findOne({
            where: { email: mail },
            raw: true,
            attributes: ['id', 'email', 'nombre', 'passwordhash', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })
        
        console.log(data.email) // Replace 'email' with 'data.email'

        if (data === null)
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos.' })

        const passwordMatch = await bcrypt.compare(password, data.passwordhash)
        if (!passwordMatch)
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos.' })

        token = GeneraToken(data.email, data.nombre, data.rol)
        return res.status(200).json({
            email: data.email,
            nombre: data.nombre,
            rol: data.rol,
            jwt: token
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

// GET: api/auth/tiempo
self.tiempo = async function (req, res) {
    const tiempo = TiempoRestanteToken(req)
    if (tiempo === null)
        return res.status(404).send()
    return res.status(200).send(tiempo)
}

module.exports = self