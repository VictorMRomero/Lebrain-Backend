const Role = require('../models/role');
const {Usuario, Materia, Subtema} = require('../models');



const esRolValido = async(rol = '') => {
    
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
            throw new Error('El rol no esta registrado en la bd');
    }
}


const exiteEmail = async (correo = '') => {
    
    const existEmail = await Usuario.findOne({correo});

    if(existEmail){
        throw new Error('El email ya existe');
    }
}

const exiteUsuarioID = async (id) => {
    
    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario){
        throw new Error(`El id: ${id} no existe `);
    }
}

//casi identico
const existeMateriaID = async (id) => {
    const existeMateria = await Materia.findById(id);

    if(!existeMateria){
        throw new Error(`el id: ${id} no existe`)
    }
}

//casi identico
const existeSubtemaID = async (id) => {
    const existeSubtema = await Subtema.findById(id);

    if(!existeSubtema){
        throw new Error(`el id: ${id} no existe`)
    }
}

module.exports = {
    esRolValido,
    exiteEmail,
    exiteUsuarioID,
    existeMateriaID,
    existeSubtemaID
}