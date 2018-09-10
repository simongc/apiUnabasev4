const { log } = console;

const mainConfig = require('../config/main.js')
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bool = require('normalize-bool');

const utility = require('../config/lib/utility.js');

const { users } = require('../controllers/users.js')

// module.exports = function (router, ensureAuthenticated){

/*
{
	get--/ list of  = require('../controllers/user')
	get--/:id  info of one user
	post--/  create one user
	put--/ update one user
}

*/

// router.use(utility.isAuth);

// router.get('/', (req, res) => {
// 	User.paginate({}, { page: 1, limit: 1000 }, (err, users) => {
// 		if(err){
	
// 		}else{
// 			res.send(users)
// 		}
// 	})
// })

router.get('/', users.users)
// .get('/:q', (req, res) => {
// 	let query, options;

// 	query = {}
// 	options = {
// 		page: req.params.q || 1,
// 		limit: 20
// 	}
// 	User.paginate(query, options, (err, users) => {
// 		if(err){

// 		}else{
// 			res.send(users)
// 		}
// 	})
// });

// Task.paginate(query, options, (err, tasks) => {
// 	if (err){
// 		log(err)
// 	}else{
// 		tasks.state = 'search';
// 		res.send(tasks);

// 	}
// });

// ruta alternativa guardar user
router.post('/save/:id', (req, res) => {
	let id = req.params.id;

	let user = req.body;

	user.address = {};
	user.address.street = req.body.street;
	user.address.number = req.body.number;
	user.address.town = req.body.town;
	user.address.city = req.body.city;
	user.address.region = req.body.region;
	user.active = bool(req.body.active);
	
	User.updateUser(id, user,{}, (err, user) => {
		if(err){
			console.log(err);
			res.redirect('/users');
		}else{
			res.redirect('/users');
		}
	});
});

// router.get('/getter', (req, res) => {

// 	res.render('./users/users');
// });
// router.get('/', (req, res) => {
// 	res.render(`main/home`, {
// 		path: 'users'
// 	});
// });
router.put('/set/notifications', (req, res) => {
	let set;
	switch (req.body.notification) {
		case 'changeResponsable':
			set = { 'notifications.internal.task.changeResponsable': req.body.state };
			break;
	}
	User.update({ _id: req.body.id }, {$set: set}, (err, status) =>{
		if(err){
			log(err)
		}else{
			res.send(status);
		}
	});

});
router.get('/invite/check', (req, res)=> {
	User.find({'relations.invites': req.user.google.email})
	.exec((err, users) => {
		log(users)
		res.send(users)
	})
})
// router.get('')
router.post('/invite', (req, res) => {
	log('from invite')
	log(req.body)
	let message = {};
	message.to = req.body.email;
	message.subject = `${req.user.name} te ha invitado a M, tu mundo!`
	User.findOne({ $or: [{'google.email': req.body.email}, {email: req.body.email}]})
	.exec((err, user) => {
		if(err) log(err)

		if(user){
			// let update = {
			// 	$addToSet: { participants: {_id: user._id} }
			// }
			// Task.findOneAndUpdate({'_id': req.body.task}, update, {}, (err, task) => {
			Task.findOne({'_id': req.body.task}, (err, task) => {
				if(err){
					log(err);
				}else{
					// res.send(task);

					message.html = `${req.user.name} te ha invitado a la tarea ${task.name}
						<br/>
						<a class="uNoDeco uLink" href="http://${mainConfig.host}/t/${task._id}?guestId=${req.user._id}&invite=${user._id}&task=${task._id}">Ingresa aquí a la tarea </a>

					`
					// transporter.sendMail(sendTemplate(message), (error, info) => {
					// 	if (error) {
					// 		console.log('Error occurred trying to send template');
					// 		console.log(error.message);
					// 		return false;
					// 	}
					// 	console.log('>>>>>>>>>>>>>>>>>>Message sent successfully!<<<<<<<<<<<  '+message.to);
					// 	res.send(info)
					// })

				}
			});
		}else{
			let inviteUser = new User();
			inviteUser.email = req.body.email
			inviteUser.history.inviteUrl = req.body.url
			inviteUser.save((err, user) => {
				if(err){
					log(err)
				}else{
					// let update = {
					// 	$addToSet: { participants: {_id: user._id} }
					// }
					// Task.findOneAndUpdate({'_id': req.body.task}, update, {}, (err, task) => {
					// 	if(err)
					// 		log(err);
					// 	res.send(task);
					// });
					Task.findOne({'_id': req.body.task}, (err, task) => {
						if(err){
							log(err);
						}else{
							// res.send(task);
							message.html = `${req.user.name} ha pensado en ti y  has sido invitado a formar parte de esta genial plataforma para que organices y colabores
								<br/>
								<a class="uNoDeco uLink" href="http://${mainConfig.host}?guestId=${req.user._id}&invite=${user._id}&task=${task._id}">Ingresa aquí con tu correo <img src="${mainConfig.host}/img/gmail1.png" height="40" width="40" style="vertical-align:middle"></a>
	
							`
							// transporter.sendMail(sendTemplate(message), (error, info) => {
							// 	if (error) {
							// 		console.log('Error occurred trying to send template');
							// 		console.log(error.message);
							// 		return false;
							// 	}
							// 	console.log('>>>>>>>>>>>>>>>>>>Message sent successfully!<<<<<<<<<<<  '+message.to);
							// 	res.send(info)
							// })
		
	
						}
					});


					
				}

			});
		}
	})


})

router.get('/stopnotify', (req, res) => {

	let set;		
	set = { 'notifications.email.task.newTask': false };
	User.update({ _id: req.user._id }, {$set: set}, (err, status) =>{
		if(err){
			log(err)
		}else{
			res.render('./users/stopnotify', {
				url: mainConfig.host
			});
		}
	});


})


//ruta ver lista de users
router.get('/get', (req, res) => {
	User.find({}, (err, users) => {
		if(err){
			console.log(err);
		}else{
			// res.render('./users/users', {
			// 	title: 'Users',
			// 	users: users
			// });
			res.send(users);
		}
	});
});
router.get('/get/:id', (req, res) => {
	User.findOne({_id: req.params.id}, (err, user) => {
		if(err){
			console.log(err);
		}else{
			res.send(user);
		}
	});
});
router.post('/find', (req, res) => {
	log('from find')
	log(req.body)
	let q = req.body.q;
	let query = {
		$and: [
			{ $or: [{username: { '$regex': q, '$options': 'i'}}, {name: { '$regex': q, '$options': 'i'}}] },
			{ 'relations.related': req.user._id }

		]
	}
	User.find(query, (err, users)=> {
		if(err){
			log(err)
		}else{
			res.send(users);
		}
	});
});
router.all('/findBy', (req, res) => {
	log('from findBYBY::::::::::::::')
	// log(req.params)
	log(req.query)
	let q = req.query.term;
	let query = {
		$and: [
			{ $or: [{username: { '$regex': q, '$options': 'i'}}, {name: { '$regex': q, '$options': 'i'}}] },
			{ 'relations.related': req.user._id }

		]
	}
	let data = []
	User.find(query, (err, users)=> {
		if(err){
			log(err)
		}else{
			for(let user of users){
				data.push({
					value: '@'+user.name,
					uid: user._id
				})
			}
			res.send(data);
		}
	});
});

// ruta ver datos de un user
router.get('/u/:id', function(req, res){
	console.log("req.params.id");
	console.log(req.params.id);
	User.findById(req.params.id, function(err, user){
		res.render('./users/user', {
			user : user
		});
		
	});
});
// perfil de usuario
router.get('/profile', function(req, res){
	// console.log("req.user");
	// console.log(res.locals.user);
	// console.log(req.user);
	res.render('./users/user', {
		user : req.user
	});
});

// user remove empresa
router.post('/removeEmpresaUser', function(req, res) {
	console.log("---------------------");
	console.log(req.body);
	console.log("---------------------");
	console.log(req.params);
});

// ruta eliminar user
router.get('/delete/:id', (req, res) => {
	let myquery = { _id: req.params.id };
	User.deleteOne(myquery, function(err, obj) {
		if (err){
			console.log(err);
		}else{
			res.redirect('/users');
		}
	});
});

router.get('/logout', function(req, res){
	req.flash('success_msg', 'Cesión cerrada');
	req.logout();

	// req.session.destroy();
	res.redirect('/');
});

router.get('/password-change', function(req, res){
	res.render('users/passwordChange');
});

router.post('/password-change', function(req, res){
	let oldPassword = req.body.oldPassword;
	let password = req.body.password;
	let userId = req.body.userId;
	console.log(oldPassword);
	let res_change = {}
	User.findById(userId, function(err, user){
		if(user.validPassword(oldPassword)){
			// user.nopassword = password;
			user.password = user.generateHash(password);
			user.save();
			// req.flash('success_msg', 'Cambio exitoso');
			console.log( 'Cambio exitoso');
			res_change.success = true;
			res.send(res_change);
			// res.redirect(req.get('referer'));
		} else{
			console.log( 'Cambio fallido');
			res_change.success = false;
			res.send(res_change);
			// req.flash('error_msg', 'contraseña invalida');
			// res.redirect(req.get('referer'));

		}

		// bcrypt.compare(oldPassword, user.password, function(err, response) {
		//     // res === true 
		//     console.log("first");
		//     console.log(user.password);
		//     if(response){
		//     	console.log("second");
		//     	user.password = password;
		//     	console.log(user.password);
		// 		user.nopassword = user.password;

		// 		User.updateUser(user._id, user,{}, (err, user) => {
		// 			if(err){
		// 				console.log(err);
		// 				req.flash('error_msg', err);
		// 				res.redirect(req.get('referer'));
		// 			}else{
		// 				req.flash('success_msg', 'Cambio exitoso');
		// 				res.redirect(req.get('referer'));
		// 			}
		// 		});
		//     }else{
		//     	console.log("third");
		// 		req.flash('error_msg', 'contraseña invalida');
		// 		res.redirect(req.get('referer'));
		//     }
		// });



	});	

});

// router.get('/:action', (req, res) => {
// 	res.render('./users/add',{
// 		action: req.params.action
// 	});
// }).post('/:action', (req, res) => {
// 	let user = new User();
// 	// console.log("req body");
// 	// console.log(req.body);
// 	user.username = req.body.username;
// 	user.password = user.generateHash(req.body.password);;
// 	user.name = req.body.name;
// 	user.active = bool(req.body.active);
// 	user.rut = req.body.rut;
// 	user.phone = req.body.phone;
// 	user.cellphone = req.body.cellphone;
// 	user.email = req.body.email;
// 	user.address = {};
// 	user.address.street = req.body.street;
// 	user.address.number = req.body.number;
// 	user.address.town = req.body.town;
// 	user.address.city = req.body.city;
// 	user.address.region = req.body.region;


// 	// save the user
// 	user.save(function(err) {
// 		if (err)
// 			throw err;

// 		req.flash('success_msg', 'Usuario creado');
// 		if(req.params.action == 'add'){
// 			res.redirect('/users');
// 		}else{
// 			res.redirect('/users/profile');
// 		}
// 	});
// });

module.exports = router;
// 	return router;
// }

