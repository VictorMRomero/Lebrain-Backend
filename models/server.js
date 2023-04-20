
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config') 

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:     '/api/auth',
            materias: '/api/materias',
            subtemas: '/api/subtemas',
            usuarios: '/api/usuarios'
        }
     

        //Conectar a base de datos
        this.conectarDB();



        //middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
        

    }

    async conectarDB(){
        await dbConection();
    }

    middlewares(){
       
        //cors
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());
       
        //Directorio publico
        this.app.use(express.static('public'))


    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.materias, require('../routes/materias'));
        this.app.use(this.paths.subtemas, require('../routes/subtemas'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto ', this.port)
        });
    }

}

module.exports = Server;