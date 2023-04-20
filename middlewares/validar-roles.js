const { response } = require("express");
const usuario = require("../models/usuario");


const esAdminRole = (req, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar el role sin validar'
        });
    }

    const {rol, nombre} = req.usuario;
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg:`${nombre} no es administrador - you cant this`
        });
    }

    next();
}

const tieneRol = (...roles) => {

    return (req, res = response, next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se requiere verificar el role sin validar el token primero'
            });
        }
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: 'No tienes un rol permitido para hacer la operacion '
            })
        }
        next();
    }

}


module.exports = {
    esAdminRole,
    tieneRol
}