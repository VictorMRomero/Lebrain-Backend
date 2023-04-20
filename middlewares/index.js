const { esAdminRole } = require('../middlewares/validar-roles');

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');



module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
}