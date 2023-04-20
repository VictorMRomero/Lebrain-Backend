
const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre : {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo : {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    imagen : {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    materias: [{
        materia: {
            type: Schema.Types.ObjectId,
            ref: 'Materia',
            required: true
        },
        subtemas: [{
            subtema: {
                type: Schema.Types.ObjectId,
                ref: 'Subtema',
                required: true
            },
            estado: {
                type: Boolean,
                default: false
            }
        }]
    }]

});

UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);
