const {response} = require('express');
const {Materia} = require('../models');


// obtener categorias -- paginado -- total -- populate
const obtenerMaterias = async(req, res = response) =>{
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado:true};

    const [total, materias] = await Promise.all([
        Materia.countDocuments(query),
        Materia.find(query)
            .populate('usuario', 'nombre')
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
    const materia = await Materia.findById(id).populate('usuario', 'nombre');

    res.json(materia);
}


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



//actualizar categoria
const actualizarMateria = async(req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, subtemas, ...resto} = req.body;


    const materia = await Materia.findById(id);





    if(subtemas){


        //Son los que vamos a guardar
        let subtemasActualizados = JSON.stringify(subtemas);
        let subtemasAntiguos = materia.subtemas;
        let total = materia.subtemas.length;
        console.log(subtemasAntiguos)
        for(let i=0; i < total; i++){
            let viejaMateria = JSON.stringify(materia.subtemas[i].subtema)

            let nuevaMateria = JSON.stringify(subtemas[0].subtema);


            if(nuevaMateria === viejaMateria){
                console.log('Son iguales')
                return res.status(400).json({ error: 'Subtema existe' });
            }
        }


        // Combinar los subtemas antiguos con los nuevos

        
        console.log(subtemasActualizados);
        //console.log(nuevasMaterias)
        
        
        const newMateria = await Materia.findByIdAndUpdate(id, {
            subtemas: [subtemasActualizados]
          });
        res.json(newMateria)
        
    } else {
    }










    const newMateria = await Materia.findByIdAndUpdate(id, resto);


    
    res.json(materia);
}




//borrar categoria -- estado false
const borrarMateria = async(req, res = response) => {
    const {id} = req.params;
    const materiaBorrada = await Materia.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json( materiaBorrada);
}


module.exports = {
    crearMateria,
    obtenerMaterias,
    obtenerMateria,
    actualizarMateria,
    borrarMateria
}