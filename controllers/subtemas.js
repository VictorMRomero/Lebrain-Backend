const {response} = require('express');
const {Subtema} = require('../models');


// obtener categorias -- paginado -- total -- populate
const obtenerSubtemas = async(req, res = response) =>{
    
    const query = {estado:true};

    const [total, subtemas] = await Promise.all([
        Subtema.countDocuments(query),
        Subtema.find(query)
            .populate('usuario', 'nombre')


    ]);

    res.json({
        total,
        subtemas
    });
}
// obtener categoria id- populate
const obtenerSubtema = async(req, res = response) => {
    const {id} = req.params;
    const subtema = await Subtema.findById(id)
    //.populate('usuario', 'nombre')
    //.populate('materia', 'nombre');

    res.json(subtema);
}


const crearSubtema = async (req, res = response ) => {

    const {estado, usuario, ...body} = req.body;

    const subtemaDB = await Subtema.findOne({nombre: body.nombre});

    if(subtemaDB) {
        return res.status(400).json({
            msg: `el subtema ${subtemaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        link:body.link,
        usuario: req.usuario._id,
    }

    const subtema = new Subtema(data);
    await subtema.save();

    res.status(201).json(subtema);

}

//actualizar categoria
const actualizarSubtema = async(req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const subtema = await Subtema.findByIdAndUpdate(id, data, {new:true});
    res.json(subtema);
}
//borrar categoria -- estado false
const borrarSubtema = async(req, res = response) => {
    const {id} = req.params;
    const subtemaBorrado = await Materia.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json( subtemaBorrado);
}


module.exports = {
    obtenerSubtema,
    obtenerSubtemas,
    crearSubtema,
    actualizarSubtema,
    borrarSubtema
}