const {Router} = require("express")
const {register, login, allUsers} = require("../controller/users.controller")

const router = Router();


router.post('/register', register);
router.post('/login', login);
router.get('/allUsers', allUsers);



module.exports = router;