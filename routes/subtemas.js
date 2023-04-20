const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');

const { existeMateriaID, existeSubtemaID } = require('../helpers/db-validators');
const { obtenerSubtema, obtenerSubtemas, crearSubtema, actualizarSubtema, borrarSubtema } = require('../controllers/subtemas');


const router = Router();

//{{url}}/api/subtemas

//obtener todos los subtemas -- publico
router.get('/', obtenerSubtemas);

//Obtener una subtema por id
router.get('/:id',[
    check('id', 'no es un id de mongo ').isMongoId(),
    check('id').custom(existeSubtemaID),
    validarCampos
], obtenerSubtema);

//Crear subtema --privado
router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    //check('subtema', 'no es un id de mongo').isMongoId(),
    //check('subtema').custom(existeMateriaID),
    validarCampos
], crearSubtema);

//Actualizar -- privado -- token valido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    //check('materia', 'no es un id de mongo').isMongoId(),
    check('id').custom(existeSubtemaID),
    validarCampos
], actualizarSubtema);


//Borrar materia
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'no es un id de mongo valido').isMongoId(),
    check('id').custom(existeSubtemaID),
    validarCampos

], borrarSubtema)






module.exports = router;