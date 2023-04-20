

const { text } = require('express');
const {Schema, model} = require('mongoose');

const SubtemaSchema = Schema({
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
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    link: {
        type: String,
    },
    disponible: {type: Boolean, default: false}
});

SubtemaSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Subtema', SubtemaSchema);
