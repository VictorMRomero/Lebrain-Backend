const { Router } = require('express');
const { check } = require('express-validator');
const { esRolValido, exiteEmail, exiteUsuarioID } = require('../helpers/db-validators');


const {
        validarCampos,
        validarJWT,
        esAdminRole,
        tieneRol,
} = require('../middlewares');

const {usuariosGet,
        usuarioGetId, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch} = require('../controllers/usuarios');



const router = Router();


//Obtener los usuarios
router.get('/', usuariosGet);


//Crear usuario
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El pasword es obligatorio minimo 8 caracteres').isLength({min: 8}),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom(exiteEmail),
        //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        validarCampos
] ,usuariosPost);    



//Obtener los usuarios por id
router.get('/:id', [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(exiteUsuarioID),
        validarCampos
],usuarioGetId)


//actualizarUsuario
router.put('/:id',[
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(exiteUsuarioID),

        validarCampos
], usuariosPut);    




router.delete('/:id', [
        validarJWT,
        //esAdminRole,
        tieneRol('ADMIN_ROL, VENTAS_ROL'),
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(exiteUsuarioID),
        validarCampos
], usuariosDelete);    

router.patch('/', usuariosPatch);  






module.exports = router;