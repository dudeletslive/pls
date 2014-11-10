var async = require('async'),
	keystone = require('keystone'),
	auth = require('basic-auth');
 
var Contact = keystone.list('Contact'),
	username = 'PrayerLetterService',
	password = '543d6f57f48d1d4caef597e5';

/**
 * List Contacts
 */
exports.list = function(req, res) {

	var credentials = auth(req);

	if (!credentials || credentials.name !== 'PrayerLetterService' || credentials.pass !== password) {
		req.flash('error', 'API Auth failed');
		res.redirect('/');
	}

	Contact.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			contacts: items
		});
		
	});
}

/**
 * Create Contact
 */
exports.create = function(req, res) {

	var credentials = auth(req);

	if (!credentials || credentials.name !== 'PrayerLetterService' || credentials.pass !== password) {
		req.flash('error', 'API Auth failed');
		res.redirect('/');
	}
	
	var item = new Contact.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			contact: item
		});
		
	});
}

/**
 * Update Contact
 */
exports.update = function(req, res) {

	var credentials = auth(req);

	if (!credentials || credentials.name !== 'PrayerLetterService' || credentials.pass !== password) {
		req.flash('error', 'API Auth failed');
		res.redirect('/');
	}

	Contact.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				contact: item
			});
			
		});
		
	});
}

/**
 * Delete Contact
 */
exports.remove = function(req, res) {

	var credentials = auth(req);

	if (!credentials || credentials.name !== 'PrayerLetterService' || credentials.pass !== password) {
		req.flash('error', 'API Auth failed');
		res.redirect('/');
	}

	Contact.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}
 