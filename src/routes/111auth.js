
let express = require('express');
let router = express.Router();
let User = require('../models/user');
const passport = require('passport');


const { log } = console;

let bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// module.exports = (router, passport) => {

	//ruta formulario añadir user
	router.get('/signup', function(req, res) {
		if(req.isAuthenticated()){
			res.redirect('/users/profile')
		}else{
			res.render('users/signup', { 
				message: req.flash('signupMessage')
			});		
		}
	});
	router.post('/test', (req, res) => {
		console.log(req.body)
		res.send(req.body)
	})


	//ruta crear user
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/users/profile', // redirect to the secure profile section
		failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	router.get('/google', passport.authenticate('google', {scope: ['profile', 'email','https://www.googleapis.com/auth/calendar','openid']}));


	router.get('/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/users/profile', failureFlash: true }),
	  function(req, res) {
		// Successful authentication, redirect home.
		// req.session.access_token = req.user.accessToken;
		req.session.access_token = req.user.google.accessToken;
		if(typeof req.user.history.emailUrl != 'undefined'){
			let url = req.user.history.emailUrl;
			let update = {
				$unset: {
					'history.emailUrl': ''
				}
			}
			User.findOneAndUpdate({_id: req.user._id}, update, {}, (err, user) => {
				if(err)
					log(err)
				log('user.username')
				log(user.username)
			})
			res.redirect(url)
		}else if(typeof req.user.history.inviteUrl != 'undefined'){
			let url = req.user.history.inviteUrl;
			let update = {
				$unset: {
					'history.inviteUrl': ''
				}
			}
			User.findOneAndUpdate({_id: req.user._id}, update, {}, (err, user) => {
				if(err)
					log(err)
				log('user.username')
				log(user.username)
			})
			res.redirect(url)
		}else{
			res.redirect('/tasks');			
		}
	  });


	router.post('/login',
		passport.authenticate('local-login', {successRedirect: '/home', failureRedirect: '/auth/login', failureFlash: true}),
		function(req, res){
			res.redirect('/tasks');
		});


	router.get('/login', function(req, res){
		if(req.isAuthenticated()){
			res.redirect('/tasks')
		}else{
			res.render('users/login',{
				reqUrl: req.query.reqUrl
			});
		}
	});


	
	// locally --------------------------------
		router.get('/connect/local', function(req, res) {
			res.render('users/connect-local', { message: req.flash('loginMessage') });
		});
		router.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
	 // google ---------------------------------

		// send to google to do the authentication
		router.get('/connect/google',
		passport.authorize('google', { scope : ['profile', 'email','https://www.googleapis.com/auth/calendar', 'openid'] , failureFlash: true}));

		// the callback after google has authorized the user
		router.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/',
				failureFlash : true // allow flash messages
			}));	

				// the callback after google has authorized the user
	


module.exports = router;
// 	return router;
// }