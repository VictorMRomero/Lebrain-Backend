const { response, request } = require('express');

const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    //const {q, nombre = 'no name', apikey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado:true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}


//Crear Usuario
const usuariosPost = async(req, res = response) => {
    

    //Solo se reciben el nombre, correo, password
    const {nombre, correo, password} = req.body;


    const usuario = new Usuario({nombre, correo, password});
      // Guardar los cambios en la base de datos
 

    // Verificar si el correo existe


    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    
    //Guardar en base de datos
    await usuario.save();

    res.json({
        usuario
    });
}



const usuarioGetId = async(req, res = response) => {
    const {id} = req.params;
    const usuario = await Usuario.findById(id);

    res.json(usuario);
}


//actualizar Usuario
const usuariosPut = async(req, res = response) => {

    try{

        const {id} = req.params;
        const {_id, password, google, correo, materias, ...resto} = req.body;
    
        if(materias){
            
            let materiaNueva = materias[0].materia; //idmateria
            let subtemaCompleto = materias[0].subtemas; //objeto subtema
            let subtemaNuevo = materias[0].subtemas[0].subtema; //id subtema
            let calificacion = materias[0].subtemas[0].calificacion; //calificacion que llega
            let estado = materias[0].subtemas[0].estado; //estado que llega

        
        
            const exiteMateria = await Usuario.findOne({
            "_id": id,
            "materias": {
                "$elemMatch": { "materia": materiaNueva }
            }
            }).exec();
        
            if(exiteMateria){
    
                const existeSubtema = await Usuario.findOne({
                    "_id": id,
                    "materias": {
                      "$elemMatch": {
                        "materia": materiaNueva,
                        "subtemas": {
                          "$elemMatch": { "subtema": subtemaNuevo }
                        }
                      }
                    }
                  }).exec();
        
                if(existeSubtema){

                    await Usuario.updateOne(
                        { 
                          "_id": id,
                          "materias.materia": materiaNueva,
                          "materias.subtemas.subtema": subtemaNuevo
                        },
                        { 
                          $set: { 
                            "materias.$[].subtemas.$[subtema].calificacion": calificacion,
                            "materias.$[].subtemas.$[subtema].estado": estado 
                          } 
                        },
                        { arrayFilters: [ { "subtema.subtema": subtemaNuevo } ] }
                      );
                    
                      
                } else{//existe Subtema
    
                    await Usuario.updateOne(
                        { "_id": id, "materias.materia": materiaNueva },
                        { $addToSet: { "materias.$.subtemas": { "subtema": subtemaNuevo} } }
                      );
        
                }
            } else {// existeMateria 
                await Usuario.updateOne(
                    { "_id": id },
                    { $push: { "materias": { "materia": materiaNueva, "subtemas": subtemaCompleto } } }
                  );
            
            }
        } 
        
        if (password){
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }
        
        const newusuario = await Usuario.findByIdAndUpdate(id, resto);
        res.json(newusuario);
    
        

    } catch {
        return res.status(400).json({
            msg: `Error en el body del documento`
        });
    }



}



const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;
    
    //Fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);
    //estado
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})


    res.json({usuario});
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
}



module.exports = {
    usuariosGet,
    usuarioGetId,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

}