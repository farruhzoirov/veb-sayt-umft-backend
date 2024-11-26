const router = require('express').Router()

const UserController = require('../controllers/user/user.controller')
const authMiddleware = require('../middlewares/auth.middleware');

const upload = require("../utils/uploads/upload-users.helper");

const userController = new UserController();

router.get('get/:userId', userController.get);


router.get('/get-all', userController.all);

router.post('/add', upload.fields(
    [
        {
            name: 'image', maxCount: 5
        },
    ]
), userController.create);


router.put('/:userId', upload.fields(
    [
        {
            name: 'image', maxCount: 5
        },
    ]
), userController.update)

router.delete('/delete', userController.delete);


module.exports = router;