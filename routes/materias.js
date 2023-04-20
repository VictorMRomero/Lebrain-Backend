const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearMateria,
        obtenerMaterias, 
        obtenerMateria, 
        actualizarMateria,
        borrarMateria } = require('../controllers/materias');
const { existeMateriaID } = require('../helpers/db-validators');


const router = Router();

//{{url}}/api/materias

//obtener todas las materias -- publico
router.get('/', obtenerMaterias);

//Obtener una materia por id
router.get('/:id',[
    check('id', 'no es un id de mongo valido').isMongoId(),
    check('id').custom(existeMateriaID),
    validarCampos
], obtenerMateria);

//Crear materia --privado
router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),

    validarCampos
], crearMateria);

//Actualizar -- privado -- token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeMateriaID),
    validarCampos
], actualizarMateria);

//Borrar materia
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'no es un id de mongo valido').isMongoId(),
    check('id').custom(existeMateriaID),
    validarCampos

], borrarMateria)






module.exports = router;