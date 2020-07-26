const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');
const _ = require('underscore');
const producto = require('../models/producto');



//==================================
// Obtener todos los productos
//==================================
app.get('/productos', verificaToken, (req, res) => {
    // populate usu - cat
    // paginado

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No se encuentran productos'
                        }
                    });
                }
            }
            res.json({
                ok: true,
                producto: productos
            });
        })

});

//==================================
// Obtener los productos por id
//==================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate usu - cat
    // paginado
    let id = req.params.id
    Producto.findById(id)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No se encuentran productos'
                        }
                    });
                }
            }
            res.json({
                ok: true,
                producto: productos
            });
        })
});

//==================================
// Buscar productos
//==================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
});

//==================================
// Crear un nuevo producto
//==================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar us - grabar cat
    // paginado
    let body = req.body;
    //let idCat = req.params.id;


    let idUs = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: idUs
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })

});

//==================================
// Actulizar Producto
//==================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // populate usu - cat
    // paginado
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es válido'
                }
            });
        }
        if (!productoDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//==================================
// Desactivación del producto - Disponible = false
//==================================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es válido'
                }
            });
        }
        if (!productoDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se pudo actualizar'
                    }
                });
            }
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

module.exports = app;