const { pelicula, categoria, Sequelize } = require('../models')
const Op = Sequelize.Op

let self = {}

// GET: api/peliculas
self.getAll = async function (req, res) {
    try {
        const { s } = req.query

        const filters = {}
        if (s) {
            filters.titulo = {
                [Op.like]: `%${s}%`
            }
        }

        let data = await pelicula.findAll({
            where: filters,
            attributes: [['id', 'peliculaId'], 'titulo', 'sinopsis', 'anio', 'poster'],
            include: {
                model: categoria,
                as: 'categorias',
                attributes: [['id', 'categoriId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            },
            subQuery: false
        })
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// GET: api/peliculas/5
self.get = async function (req, res) {
    try {
        let id = req.params.id
        let data = await pelicula.findByPk(id, {
            attributes: [['id', 'peliculaId'], 'titulo', 'sinopsis', 'anio', 'poster'],
            include: {
                model: categoria,
                as: 'categorias',
                attributes: [['id', 'categoriId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            }
        })
        if (data) {
            return res.status(200).json(data)
        } else {
            return res.status(400).send()
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

// POST: api/peliculas
self.create = async function (req, res) {
    try {
        let data = await pelicula.create({
            titulo: req.body.titulo,
            sinopsis: req.body.sinopsis,
            anio: req.body.anio,
            poster: req.body.poster
        })
        return res.status(201).json(data)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// PUT: api/peliculas/5
self.update = async function (req, res) {
    try {
        let id = req.params.id
        let body = req.body
        let data = await pelicula.update(body, { where: { id: id } })
        if (data[0] === 0) {
            return res.status(404).send()
        } else {
            return res.status(204).send()
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

// DELETE: api/peliculas/5
self.delete = async function (req, res) {
    try {
        let id = req.params.id
        let data = await pelicula.findByPk(id)
        if (!data) {
            return res.status(404).send()
        }
        data = await pelicula.destroy({ where: { id: id } })
        if (data === 1) {
            return res.status(204).send()
        } else {
            return res.status(404).send()
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

// POST: api/peliculas/categoria
self.asignaCategoria = async function (req, res) {
    try {
        let itemToAssign = await categoria.findByPk(req.body.categoriaid)
        if (!itemToAssign) return res.status(404).send()

        let item = await pelicula.findByPk(req.params.id)
        if(!item) return res.status(404).send()

        await item.addCategoria(itemToAssign)
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json(error)
    }
}

// DELETE: api/peliculas/categoria/1
self.eliminaCategoria = async function (req, res) {
    try {
        let itemToRemove = await categoria.findByPk(req.params.categoriaid)
        if (!itemToRemove) return res.status(404).send()

        let item = await pelicula.findByPk(req.params.id)
        if (!item) return res.status(404).send()

        await item.removeCategoria(itemToRemove)
        return res.status(204).send()
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = self