const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');
const _ = require('underscore');


//=============================
//Mostrar todas las categórias
//=============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria
            })

        })

});
//=============================
//Mostrar una categoría por ID
//=============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let idCat = req.params.id;
    Categoria.findById(idCat)
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria
            });
        });
});

//=============================
//Crear nueva categórias
//=============================
app.post('/categoria', verificaToken, (req, res) => {

    console.log('test');
    let body = req.body;
    let idUs = req.usuario._id;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: idUs
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//=============================
//Actualizar la categória
//=============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let idCat = req.params.id;
    let descripcion = _.pick(req.body, ['descripcion']);

    /* Forma del video
    let descCat = {
        descripcion: body.descripcion
    }; */



    Categoria.findByIdAndUpdate(idCat, descripcion, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});
//=============================
//Borrado de categoria solo ADMIN
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada,
            mensaje: 'Categoria Borrada'
        })
    });
});


module.exports = app;