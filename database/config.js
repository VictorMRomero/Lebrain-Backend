
const mongoose = require('mongoose');

const dbConection = async () => {

    try{

        await mongoose.connect(process.env.MONGODB_CNN);

        console.log('Base de datos online');

    } catch(error){
        throw new Error(error);

    }
}

module.exports = {
    dbConection
}
