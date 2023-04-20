

const { text } = require('express');
const {Schema, model} = require('mongoose');

const SubtemaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },

    materia: {
        type: Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },

    link: {
        type: String,
    },

});

SubtemaSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Subtema', SubtemaSchema);
