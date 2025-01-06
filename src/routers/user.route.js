const router = require('express').Router()

const UserController = require('../controllers/user/user.controller')
const authMiddleware = require('../middlewares/auth.middleware');

const userController = new UserController();

router.get('get/:userId', authMiddleware.adminMiddleware, userController.get);

router.get('/get-all', authMiddleware.adminMiddleware, userController.all);

router.post('/add-manager', authMiddleware.adminMiddleware,  userController.create);

router.put('/:userId', authMiddleware.adminMiddleware,  userController.update)

router.delete('/delete', authMiddleware.adminMiddleware, userController.delete);


module.exports = router;