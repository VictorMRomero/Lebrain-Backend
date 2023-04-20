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

const usuarioGetId = async(req, res = response) => {
    const {id} = req.params;
    const usuario = await Usuario.findById(id);

    res.json(usuario);
}

const usuariosPut = async(req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, materias, ...resto} = req.body;

    const usuario = await Usuario.findById(id);

    if (password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    if(materias){
        
        // Estos subtemas llegan
        let nuevasMaterias = materias[0].materia;

        let nuevosSubtemas = materias[0].subtemas;

        let idnuevoSubtema = JSON.stringify(nuevosSubtemas[0].subtema);

        //Son los que vamos a guardar
        let subtemasActualizados = nuevosSubtemas;
       
        if((usuario.materias).length){


            let total = usuario.materias[0].subtemas.length;
            console.log(total)

            
            for(let i = 0; i < total; i++){
                console.log(i)
                let existe = JSON.stringify(usuario.materias[0].subtemas[i].subtema);
                if(existe === idnuevoSubtema){
                    console.log('es igual');
                    
                    return res.status(400).json({ error: 'Uno o más subtemas ya existen' });
                }
            }
 
            /*
            if (subtemasExisten) {
                res.status(400).json({ error: 'Uno o más subtemas ya existen' });
            }
*/

            let subtemasAntiguos = usuario.materias[0].subtemas;
            //console.log(subtemasAntiguos)
            // Combinar los subtemas antiguos con los nuevos
            subtemasActualizados = subtemasAntiguos.concat(nuevosSubtemas);
            
            nuevasMaterias = {
              materia: nuevasMaterias,
              subtemas: subtemasActualizados
            };
            //console.log(nuevasMaterias)
            const newusuario = await Usuario.findByIdAndUpdate(id, {
              materias: [nuevasMaterias]
            });
            res.json(newusuario);
        } else {
            nuevasMaterias = {
              materia: nuevasMaterias,
              subtemas: subtemasActualizados
            };
            const newusuario = await Usuario.findByIdAndUpdate(id, {
                materias: [nuevasMaterias],
            });
            res.json(newusuario);
        }
    } else {
        const usuarioNom = await Usuario.findByIdAndUpdate(id, resto);
        res.json(usuarioNom);
    }
}




const usuariosPost = async(req, res = response) => {
    


    const {nombre, correo, password, rol} = req.body;


    const usuario = new Usuario({nombre, correo, password, rol});
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