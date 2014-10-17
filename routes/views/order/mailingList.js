var keystone = require('keystone'),
	List = keystone.list('Mailing Lists'),
	Contact = keystone.list('Contact'),
	User = keystone.list('User'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'mailingList';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.letterDetails = req.session.letterDetails;
	// Part One of formData
	req.session.letterDetails = locals.formData;

	locals.redirect = req.url;
	locals.mailerType = req.query.mailer;
	
	console.log(req.session.mailerType);

	// console.log('Mailing List: ' + req.session);

	// Find Current User to Base lists loaded on
	User.model.findById(req.session.userId).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});

	view.query('lists', keystone.list('Mailing Lists').model.find().where('userID', req.user._id).sort('sortOrder'));

	if (req.method === 'POST' && req.body.action === 'newList') {

		var mailingList = {
			userID: locals.user.id,
			uploadedBy: locals.user.id,
			listName: req.body.listName + ' - ' + locals.user.id,
			prettyName: req.body.listName
		};

		console.log(req.body.csvJSON);
		
		var List = keystone.list('Mailing Lists').model,
			newList = new List(mailingList),
			CSV = JSON.parse(req.body.csvJSON);

		newList.save(function(err, model) {
			var id = model._id;
			// When you create the mailing list, go through and create contacts from the JSON Array
			for (contact in CSV) {
				var contactInfo = {
					mailingList: id,
					firstName: CSV[contact].firstName,
					lastName: CSV[contact].lastName,
					ENV_LINE: CSV[contact].firstName + ' ' + CSV[contact].lastName,
					addressOne: CSV[contact].address1,
					addressTwo: CSV[contact].address2,
					addressThree: CSV[contact].address3,
					city: CSV[contact].city,
					state: CSV[contact].state,
					postCode: CSV[contact].zip
				};
				var Contact = keystone.list('Contact').model,
					newContact = new Contact(contactInfo);
				newContact.save(function(err) {
				});
			}
			if(!req.body.redirect) {
				req.flash('success', 'Your new mailing list was created successfully. You can edit it below.');
				res.redirect(req.originalUrl);
			} else {	
				req.flash('success', 'Your new mailing list was created successfully. You may now select it below.')
				res.redirect(req.body.redirect);
			}
			// return cb(err);
		});

	} else {

		if (!req.query.mailer) {
			res.redirect('/order');
			req.flash('error', 'Please select a type of mailer before proceeding.');
		} else {
			locals.mailerType = req.query.mailer;
			view.render('order/mailingList');
		}

	}
	
};
