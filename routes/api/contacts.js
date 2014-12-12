var async = require('async'),
	keystone = require('keystone'),
	auth = require('basic-auth');
 
var Contact = keystone.list('Contact'),
	List = keystone.list('Mailing Lists'),
	User = keystone.list('User'),
	username = 'PrayerLetterService',
	password = 'd41d8cd98f00b204e9800998ecf8427e';

/**
 * Get Contact ID
 */
exports.list = function(req, res) {

	User.model.findOne({'services.MPDX.accessToken': req.headers.authorization}).exec(function (err, user) {

		List.model.findOne({'prettyName': 'MPDX List', 'userID': user._id}).exec(function(err, list) {

			Contact.model.find({'mailingList': list}).exec(function(err, contacts) {

				if (err) return res.apiError('database error', err);
				
				res.apiResponse({
					contacts: contacts
				});

			});

		});

	});

}

/**
 * Create Contact
 */
exports.create = function(req, res) {

	// Find User by Authorization
	User.model.findOne({'services.MPDX.accessToken': req.headers.authorization}).exec(function (err, user) {

		// Find MPDX Mailing List
		List.model.findOne({'prettyName': 'MPDX List', 'userID': user._id}).exec(function(err, list) {

			var id = list._id,
				contacts = req.body.contacts;

			// Add Contacts to MPDX Mailing List
			for (i = 0; i < contacts.length; ++i) {
				var contactInfo = {
					mailingList: id,
					firstName: contacts[i].name,
					addressOne: contacts[i].address['street'],
					city: contacts[i].address['city'],
					state: contacts[i].address['state'],
					postCode: contacts[i].address['postal_code'],
					contact_id: keystone.utils.randomString([24,32]),
					external_id: contacts[i].external_id
				};

				var Contact = keystone.list('Contact').model,
					newContact = new Contact(contactInfo);

				newContact.save(function(err) {});
			}

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

/**
 * Mailing List Endpoint
 */


/**
 * List Mailing Lists
 */
exports.mailingLists = function(req, res) {

	// var credentials = auth(req);

	// if (!credentials || credentials.name !== 'PrayerLetterService' || credentials.pass !== password) {
	// 	req.flash('error', 'API Auth failed');
	// 	res.redirect('/');
	// }

	List.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			mailingLists: items
		});
		
	});
}

 