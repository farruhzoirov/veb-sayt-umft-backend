const router = require('express').Router()

const UserController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth');

const upload = require("../helpers/uploads/upload-users.helper");

const userController = new UserController();

router.get('/:userId', userController.get);


router.get('/get-all', userController.all);

router.post('/add', upload.fields(
    [
        {
            name: 'image', maxCount: 1
        },
    ]
), userController.create);


router.put('/:userId', upload.fields(
    [
        {
            name: 'image', maxCount: 1
        },
    ]
), userController.update)

router.delete('/delete', userController.delete);


module.exports = router;