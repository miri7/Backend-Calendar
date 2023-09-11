/**
 * 
 events Routes
 /api/events
 */

const {Router} = require('express');
const {check} = require('express-validator')
const router = Router();
const {getEventos,crearEvento,actualizarEvento,eliminarEvento} = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');



// todas tienen que pasar por el webtoken
router.use(validarJWT);
// obtener eventos
router.get('/',getEventos)

// crear un nuevo eventos
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de Inicio es obligatorio').custom(isDate),
        check('end','Fecha de finalización es obligatorio').custom(isDate),
        validarCampos
    ],
    crearEvento
)

// actualizar eventos
router.put('/:id',
[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de Inicio es obligatorio').custom(isDate),
    check('end','Fecha de finalización es obligatorio').custom(isDate),
    validarCampos
],
actualizarEvento)

// actualizar eventos
router.delete('/:id',eliminarEvento)


module.exports = router;

