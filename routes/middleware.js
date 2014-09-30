/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
	querystring = require('querystring'),
	keystone = require('keystone');


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: 'Home',				key: 'home',		href: '/' },
		{ label: 'About Us',			key: 'about',		href: '/about' },
		{ label: 'Printing Services',	key: 'printing',	href: '/printing-services' },
		{ label: 'Options',				key: 'options',		href: '/options' },
		{ label: 'Pricing',				key: 'pricing',		href: '/pricing' },
		{ label: 'Contact Us',			key: 'contact',		href: '/contact' }
	];

	locals.orderTabs = [
		{ label: 'Letter Details',		key: 'letterDetails',	href: '/letter-details' },
		{ label: 'Mailing List',		key: 'mailingList',		href: '/mailing-list' },
		{ label: 'Return Address',		key: 'returnAddress',	href: '/return-address' },
		{ label: 'Summary',				key: 'summary',			href: '/summary' },
		{ label: 'Confirmation',		key: 'confirmation',	href: '/confirmation' },
	];
	
	locals.user = req.user;
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		var redirect = req.originalUrl,
			redirect = redirect.replace('/','');
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/sign-in?redirect=' + redirect);
	} else {
		next();
	}
	
};
