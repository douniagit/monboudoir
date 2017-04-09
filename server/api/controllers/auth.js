'use strict';

const Users = require('../../database').users;
const bcrypt = require('bcrypt');
const jsonwebtoken= require('jsonwebtoken');
const moment= require('moment');


function formatPassword(user){
	const salt=bcrypt.genSaltSync(10);
	const hash=bcrypt.hashSync(user.mail+user.password,salt);//mettre obligatoirement le pws, car la comparaison du crypt se fera dessus, mais on peut concat tout le mondel utilisateur

	return{
		mail:user.mail,
		firstName:user.firstName,
		name:user.name,
		//(mettre model user ou des elements, hash=password)
		password:hash
		}
	}

function generateToken(user){
	const payload={
		iat:moment().unix(), //isued at issu quand
		exp:moment().add(14,'days').unix(), //perime à la date de
		iss:user.mail, //createur
		sub:user.password //sujet du token= hash
	}
	return jsonwebtoken.sign(payload,'app_secret');
	console.log(jsonwebtoken.sign);
}


	const auth = {
		register(req,res){
			//const newUser= new Users(formatPassword(req.body));
			const newUser= new Users (req.body);
			newUser.save()
			.then(data =>{
				res.redirect('/login');
			})
			.catch(err=>{
				res.send(err)
			});//ok fonctionne sur postman
	},
	//login avec bcrypt---------------------------------------------------- 
		// login(req,res){
		// 	Users.find({mail:req.body.mail})
		// 	.then(users =>{
		// 		console.log(users);
		// 		if(users.length >0 && bcrypt.compareSync(req.body.mail+req.body.password, users[0].mail)){	
		// 			const token=generateToken(users);
		// 			console.log(token);
		// 			res.status(200).send('operation reussi: \n' + token);
		// 			//res.statut(200).redirect('/logged');
		// 		}
		// 		else{
		// 			res.status(500).send('wrong password or mail');
		// 		}
		// 	})
		// 	.catch(err =>{
		// 			res.send(err);
		// 	});//la condition if avec bcrypt ne marche pas sur postman
		// },
//---------------------avec jwt---------------------------------
		login (req,res){
			Users.find({mail:req.body.mail})
			.then(user =>{
				if(user.mail == req.body.mail){
					res.send(user);
					console.log(user);
					//res.redirect('/logged');
				}
				else{
					res.send('wrong password or mail');
				}
			})
			.catch(err =>{
					res.send(err);
			});
		},

	//require token
		requireToken(req,res,next){
		const token = req.get('authorization');
		if(!token)res.send('authorization required');
		jsonwebtoken.verify(token, 'app_secret',(err, decoded)=>{
			//decoded va etre egal à payload, decode.exp .iss .iat .subject
			if(err || decode.exp > moment().unix()) res.send('unauthorized');
			else next();
		})
	}
}	

module.exports = auth;