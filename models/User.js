var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const { where } = require("../database/connection");

//servive
class User {
    // BUSCA USUARIO POR ID

    async findById(id) {
        try {
            var result = await knex.select(["id", "email", "role", "name"]).where({ id: id }).table("users");

            if (result.length > 0) {
                return result;
            } else {

                return undefined
            }

        } catch (err) {
            return undefined
        }

    }

    // LISTA DE USUARIOS CADASTRADOS
    async findAll() {
        try {
            var result = await knex.select(["id", "email", "role", "name"]).table("users");
            return result;
        } catch (err) {
            return [];
        }

    }

    //CADASTRO DE USUARIO
    async new(email, password, name) {
        try {
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({ email, password: hash, name, role: 0 }).table("users");
        } catch (error) {
            console.log(error)
        }
    }

    // CHECAGEM DE EMAIL DUPLICADOS
    async findEmail(email) {
        try {
            var result = await knex.select("*").from("users").where({ email: email });

            if (result.length > 0) {
                return true;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error)

        }

    }
    //UPDATE DE USUARIO
    async update(id, email, name, role) {

        var user = await this.findById(id);

        if (user != undefined) {

            var editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    var result = await this.findEmail(email);
                    if (result == false) {
                        editUser.email = email;
                    } else {
                        return { status: false, err: "O e-mail já está cadastrado" }
                    }
                }
            }

            if (name != undefined) {
                editUser.name = name;
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else {
            return { status: false, err: "O usuário não existe!" }
        }
    }
    async delete(id) {
        var user = await this.findById(id);
        console.log(user)

        if(user != undefined) {
            try {
                await knex.delete().where({id: id}).table('users');
                return {satatus: true}
            } catch (error) {
                return {satatus: false, err: error}
            }
        } else {
            return {satatus: false, err: 'Usuario inexistente'}
        }
    }


}

module.exports = new User();