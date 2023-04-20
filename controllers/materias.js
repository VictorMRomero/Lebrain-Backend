const {response} = require('express');
const {Materia} = require('../models');


// obtener categorias -- paginado -- total -- populate
const obtenerMaterias = async(req, res = response) =>{
    const { limite = 5, desde = 0 } = req.query;


    const [total, materias] = await Promise.all([
        Materia.countDocuments(),
        Materia.find()
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        materias
    });
}
// obtener categoria id- populate
const obtenerMateria = async(req, res = response) => {
    const {id} = req.params;
    const materia = await Materia.findById(id); //.populate('usuario', 'nombre');

    res.json(materia);
}


//Crear una materia
const crearMateria = async (req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();
    const link = req.body.link;
    const descripcion = req.body.descripcion;

    const materiaDB = await Materia.findOne({nombre});

    if(materiaDB) {
        return res.status(400).json({
            msg: `la materia ${materiaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre, 
        link,
        descripcion,
        usuario: req.usuario._id
    }

    const materia = new Materia(data);
    await materia.save();

    res.status(201).json(materia);

}



//actualizar Materia
const actualizarMateria = async(req, res = response) => {
    const {id} = req.params;
    const {nombre, ...resto} = req.body;
    resto.nombre = nombre.toUpperCase();


    if(nombre){
        const nombreDB = await Materia.findOne({nombre});

        if(nombreDB) {
            return res.status(400).json({
                msg: `la materia ${nombreDB.nombre}, ya existe`
            });
        }
    }
    resto.nombre = nombre;
    const newMateria = await Materia.findByIdAndUpdate(id, resto);


    
    res.json(newMateria);


}




//borrar categoria -- estado false
const borrarMateria = async(req, res = response) => {
    const {id} = req.params;
    //const materiaBorrada = await Materia.findByIdAndUpdate(id, {estado: false}, {new: true});
    //Fisicamente
    const materiaBorrada = await Materia.findByIdAndDelete(id);
    res.json( materiaBorrada);
}


module.exports = {
    crearMateria,
    obtenerMaterias,
    obtenerMateria,
    actualizarMateria,
    borrarMateria
}