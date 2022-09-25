const { Router } = require('express');
const { requestValidator } = require('../middlewares');
const { usersValidation } = require('../validations');
const { usersController } = require('../controllers');

const router = Router();

router.get('/search/:userId/:query', requestValidator(usersValidation.search), usersController.search);

router.get('/friend/:userId/:friendId', requestValidator(usersValidation.friend), usersController.friend);

router.get('/unfriend/:userId/:friendId', requestValidator(usersValidation.unfriend), usersController.unfriend);

module.exports = router;
