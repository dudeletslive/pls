/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = { 
	views: importRoutes('./views') 
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/about', routes.views.about);
	app.get('/printing-services', routes.views.printing);
	app.get('/options', routes.views.options);
	app.get('/pricing', routes.views.pricing);
	app.all('/contact', routes.views.contact);

	// Super fancy way of handling account management page-
	// Based on the link, set locals, then display appropriate panel
	// On Account Management page based on which local variable is set.
	app.get('/forgot-password', routes.views.session.account);
	app.get('/reset', routes.views.session.account);

	// User Session
	app.all('/sign-in', routes.views.session.signIn);
	app.get('/sign-out', routes.views.session.signOut);

	// Register
	app.all('/register', routes.views.register);
	
	// Contact List Pages
	app.all('/mailing-lists', middleware.requireUser, routes.views.CRM.mailingListIndex);
	app.get('/mailing-lists/:list', middleware.requireUser, routes.views.CRM.mailingList);

	// Order Process
	app.all('/order', routes.views.order.begin);
	app.all('/letter-details', routes.views.order.letterDetails);
	app.all('/mailing-list', routes.views.order.mailingList);
	app.all('/return-address', routes.views.order.returnAddress);
	app.all('/summary', routes.views.order.summary);
	app.all('/confirmation', routes.views.order.confirmation);
	
	//My Account
	app.get('/my-account', middleware.requireUser, routes.views.session.myAccount);

	// Test CSV
	app.all('/test', routes.views.test);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
