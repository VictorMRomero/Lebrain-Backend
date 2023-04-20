
const {Schema, model} = require('mongoose');

const MateriaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type:Boolean,
        default: true,
        required: true
    },
    link: {
        type: String, 
        default:"404.html"
    },
    descripcion: {
        type: String,
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    
    subtemas:  [{
        subtema: {
        type: Schema.Types.ObjectId,
        ref: 'Subtema',   
    }
    }],
});

MateriaSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Materia', MateriaSchema);