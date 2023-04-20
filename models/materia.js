
const {Schema, model} = require('mongoose');

const MateriaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    link: {
        type: String, 
        default:"404.html"
    },
    descripcion: {
        type: String,
    },

});

MateriaSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Materia', MateriaSchema);