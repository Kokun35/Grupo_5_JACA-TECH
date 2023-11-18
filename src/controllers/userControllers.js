const fs = require('fs');
const path = require ('path');
const bcryptjs = require('bcryptjs');

const usersFilePath = path.join(__dirname, '../data/users.json');
function getUsers(){
	const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
	return users;
}
const { validationResult } = require('express-validator');


const controller = {
    login(req, res) {
        res.render('login');  
    },
    register(req, res) {
        res.render('register');
    },
    uploadRegister(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', { errors: errors.mapped(), oldData: req.body })
        };
            const users=getUsers();
            const newUser = {
                id: users[users.length - 1].id + 1,
                ...req.body,
                password: bcryptjs.hashSync(req.body.password, 10),
                image: req.file?.filename || "default-image.png"
            };
            users.push(newUser);
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4));
            res.redirect('/');
    }
};

module.exports = controller;