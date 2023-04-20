const jwt = require('jsonwebtoken');
const {response, request} = require('express');

const Usuario = require('../models/usuario');


const validarJWT = async(req, res = response, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try{

        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY);

        //leer el usuario que corresponde
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'usuario no existe'
            })
        }

        // no ha sido borrado
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'usuario en estado false'
            })
        }

        req.usuario = usuario;

        next()
    }catch(error){
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}


module.exports = {
    validarJWT
}