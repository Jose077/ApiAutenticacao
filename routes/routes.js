var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController")


router.post('/user', UserController.create);
router.get('/user', UserController.getUsers);
router.get('/user/:id', UserController.getUserById);
router.put('/user', UserController.update);
router.delete('/user/:id', UserController.delete);

module.exports = router;