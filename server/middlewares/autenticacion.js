const jwt = require('jsonwebtoken');

//==============
//Verificar Token
//==============
let verificaToken = (req, res, next) => {

    let token = req.get('token'); //  nombre del header que tiene el token

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();
    });


};

//==============
//Verificar Token en Imangen
//==============
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();
    });
}

//==============
//Verificar AdminRole
//==============

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }



    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}