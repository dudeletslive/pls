var keystone = require('keystone')
	List = keystone.list('Mailing Lists'),
	Contact = keystone.list('Contact'),
	User = keystone.list('User'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'mailingListIndex';
	locals.form = req.body;

	// Find Current User to Base lists loaded on
	User.model.findById(locals.user.id).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});

	view.query('lists', keystone.list('Mailing Lists').model.find().where('userID', locals.user.id).sort('sortOrder'));

	view.on('post', function(next) {

		var CSV = JSON.parse(req.body.csvJSON);

		async.series([
			
			function(cb) {
				
				if (!req.body.listName || !req.body.csvJSON || !req.body.mailingList) {
					locals.errors = true;
					return cb(true);
					console.log(req.body.redirect);
				}
				
				return cb();
				
			},
			
			function(cb) {

				var mailingList = {
					userID: locals.user.id,
					uploadedBy: locals.user.id,
					listName: req.body.listName + ' - ' + locals.user.id,
					prettyName: req.body.listName
				};
				
				var List = keystone.list('Mailing Lists').model,
					newList = new List(mailingList);


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
						res.redirect('/mailing-lists');
					} else {	
						req.flash('success', 'Your new mailing list was created successfully. You may now select it below.')
						res.redirect(req.body.redirect);
					}
					return cb(err);
				});
			
			},
			
		], function(err){
			
			if (err) return next();
			
			// var onSuccess = function() {
			// 	res.redirect('/mailing-lists');
			// }
			
			// var onFail = function(e) {
			// 	req.flash('error', 'Something went wrong when we tried to create your mailing list. Please try again, and contact us if the error persists.');
			// 	return next();
			// }

			// keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			
		});

	});

	// Render the view
	view.render('CRM/mailingListIndex');
};
