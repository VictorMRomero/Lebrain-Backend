const { response } = require("express");

const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try{

        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'El usuario/contraseña no son correctos -'
            })
        }

        //si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'El usuario/contraseña no son correctos - estado: false'
            })
        }

        //verificar la contraseña
        const contraValida = bcryptjs.compareSync(password, usuario.password);  
        if(!contraValida){
            return res.status(400).json({
                msg:'El usuario/contraseña no son correctos - contraseña: false'
            })
        }

        //Generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            msg:"Hable con el admin"
        });
    }

}


const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body;

 
    try{
        const {correo, nombre, img} = await googleVerify(id_token);

        
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            console.log('Si entro');
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol:'USER_ROLE',
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
            console.log('Usuario creado');
        }

        //Si el usuario en base de datos
        if(!usuario.estado){
            res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
        
    }catch(error){
        res.status(400).json({
            ok: false,
            msg:'En Token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSingIn
}