var keystone = require('keystone'),
	mailingList = keystone.list('Mailing Lists'),
	Contact = keystone.list('Contact');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'mailingList',
	locals.query = req.query.sortBy;

	locals.filters = {
		list: req.params.list
	};

	if (req.query.contact === 'add') {
		locals.addContact = true;
	}
	if (req.method === 'POST') {

		if (req.body.contactID) {

			Contact.model.findById(req.body.contactID).exec(function(err, contact) {

				if (err) {
					return next(err);
				}

				req.contact = contact;

				var contact = req.contact,
					updater = contact.getUpdateHandler(req);

				if (req.body.deleteContact === 'true') {
					
					contact.remove(function(err) {
						
						if(err) {
							res.redirect(req.originalUrl);
						} else {
							res.redirect(req.originalUrl);
						}

					});

				} else {

					updater.process(req.body, {
						flashErrors: true,
						fields: 'firstName, lastName, spouseFirstName, envelopeLine, addressOne, addressTwo, addressThree, city, state, postCode',
						errorMessage: 'There was a problem submitting your enquiry:'
					}, function(err) {

						if (err) {
							res.redirect(req.originalUrl);
							locals.validationErrors = err.errors;
						} else {
							res.redirect(req.originalUrl);
							locals.enquirySubmitted = true;
						}

					});

				}

			});

		}

		else if (req.body.action === 'newContact') {

			var contactData = {
				mailingList: req.body.mailingListID,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				ENV_LINE: req.body.ENV_LINE,
				addressOne: req.body.addressOne,
				addressTwo: req.body.addressTwo,
				addressThree: req.body.addressThree,
				city: req.body.city,
				state: req.body.state,
				postCode: req.body.postCode
			};
			
			var ContactList = keystone.list('Contact').model,
				newContact = new ContactList(contactData);

			newContact.save(function(err) {
				res.redirect(req.originalUrl);
			});

		}

	}

	view.on('init', function(next) {

		mailingList.model.findOne()
			.where('slug', locals.filters.list)
			.exec(function(err, list) {
				locals.list = list;

				Contact.model.find().where('mailingList', list._id).exec(function(err, contacts) {

					sortBy = req.query.sortBy != null ? req.query.sortBy : 'lastName';
					from = req.query.from;
					sortString = String(sortBy);

					if (sortBy === from) {
						contacts.sort(function (a, b) {
							if(a[sortString] < b[sortString]) return 1;
							if(a[sortString] > b[sortString]) return -1;
							return 0;
						});
					} else {
						contacts.sort(function (a, b) {
							if(a[sortString] < b[sortString]) return -1;
							if(a[sortString] > b[sortString]) return 1;
							return 0;
						});
					}
					
					locals.contacts = contacts;
					res.render('CRM/mailingList');

				})

				
			});

	});

	// Render the view
	view.render('CRM/mailingList');
};
