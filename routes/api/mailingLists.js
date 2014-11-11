var async = require('async'),
	keystone = require('keystone'),
	auth = require('basic-auth');
 
var Contact = keystone.list('Contact'),
	List = keystone.list('Mailing Lists'),
	username = 'PrayerLetterService',
	password = 'd41d8cd98f00b204e9800998ecf8427e';

/**
 * List Mailing Lists
 */
exports.list = function(req, res) {

	var credentials = auth(req);

	if (!credentials || credentials.name !== 'PrayerLetterService' || credentials.pass !== password) {
		req.flash('error', 'API Auth failed');
		res.redirect('/');
	}

	List.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			mailingLists: items
		});
		
	});
}
