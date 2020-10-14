const knex = require("../database/connection");
const user = require("../models/User");
var User = require("../models/User")

class UserControler {
    //DELETAR USUARIO
    async delete(req,res) {
        var id = req.params.id;
        var result = await User.delete(id);
        if(result.status) {
            res.status(200)
            res.send("deleção feita com sucesso");
        } else{
            res.send(result.err);
        }
    }
    //UPDATE DE USUARIO
    async update(req, res) {
        var {id, name, email, role} = req.body;
        var result = await User.update(id, name, email, role);
       

        if (result != undefined) {
            if(result.status) {
                res.sendStatus(200)
            } else {
                res.status(406)
                res.json({err: "email já existente"})
            }
        }
    }

    // BUSAC USUARIO POR ID PASSADO NA REQUISIÇÃO
    async getUserById(req, res) {
        try {
            var id = req.params.id;
            var userId = await User.findById(id);
            if (userId == undefined) {

                res.sendStatus(404)

            } else {
                res.send(userId)
            }
            return

        } catch (error) {
            res.status(404)
            return
        }

    }

    // LISTA USUARIOS CADASTRADOS
    async getUsers(req, res) {
        var users = await User.findAll();
        res.json(users);

    }

    async create(req, res) {

        // RECEBE OS DADOS DA REQUISIÇÃO
        var { name, email, password } = req.body;

        if (email == undefined) {
            res.status(400)
            res.json({ err: "email invalido" })
            return; //grante que a requisição seja concluida
        }

        //Checar email duplicado
        var emailexit = await User.findEmail(email);
        if (emailexit) {
            res.status(406)
            res.json({ err: "email duplicado" });
            return;
        }

        //Cadastrar novo usuario
        await User.new(email, password, name)
        res.status(200);
        res.send("Cliente registrado com sucesso");
    }
}

module.exports = new UserControler();