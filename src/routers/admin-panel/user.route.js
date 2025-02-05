const router = require('express').Router()

const UserController = require('../../controllers/admin-panel/user/user.controller')
const authMiddleware = require('../../middlewares/auth.middleware');

const userController = new UserController();

router.get('/get-all', authMiddleware.adminMiddleware, userController.all);

router.get('/:userId', authMiddleware.adminMiddleware, userController.get);

router.post('/add-user', authMiddleware.adminMiddleware, userController.create);

router.put('/:userId', authMiddleware.adminMiddleware, userController.update)

router.delete('/:userId', authMiddleware.adminMiddleware, userController.delete);

module.exports = router;