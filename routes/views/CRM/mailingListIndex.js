var keystone = require('keystone')
	List = keystone.list('Mailing Lists'),
	Contact = keystone.list('Contact'),
	User = keystone.list('User'),
	cv2json = require('convert-json'),
	async = require('async'),
	csvjs = require('csv-json'),
	underscore_ = require('underscore');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'mailingListIndex';
	locals.form = req.body;
	var user;

	// Find Current User to Base lists loaded on
	User.model.findById(req.user._id).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});
	var user = locals.user;
	
	if (user.isAdmin) {
		view.query('lists', keystone.list('Mailing Lists').model.find().where('uploadedBy', locals.user.id).sort('listName'));
	} else {
		view.query('lists', keystone.list('Mailing Lists').model.find().where('uploadedBy', locals.user.id).sort('listName'));	
	}

	if (req.method == 'POST') {

		var file = req.files.xlsFile.path;
		var fileName = req.files.xlsFile.name;
		var ext = fileName.split('.')[1];

		locals.fileType = ext;

		// // If the file is not a CSV, run this.
		// if (req.files.xlsFile.type.indexOf('csv') === -1 || req.files.xlsFile.type.indexOf('text') === -1) {

		// 	// res.redirect(req.originalUrl);
		// 	if (ext === 'xlsx' || ext === 'xlx')
		// 		// req.flash('error', 'Please make sure your file is a .CSV. Click <a href="#" data-toggle="modal" data-target="#instructions">here</a> for instructions on converting your .' + ext + ' file to a CSV.');
		// 		console.log('This.')
		// 	else
		// 		console.log('This.')
		// 		// req.flash('error', 'Please make sure your file is a .CSV.')
		// 	// return false;

		// // If it's a CSV file, run this.
		// }

		async.series([
			
			function(cb) {
				
				if (!req.body.listName) {
					locals.errors = true;
					return cb(true);
				}
				
				return cb();
				
			},
			
			function(cb) {

				var mailingList = {
					userID: locals.user.id,
					uploadedBy: locals.user.id,
					listName: req.body.listName + ' - ' + locals.user.name.first + ' ' + locals.user.name.last,
					prettyName: req.body.listName
				};
				
				var List = keystone.list('Mailing Lists').model,
						newList = new List(mailingList);

				newList.save(function(err, model) {
					var id = model._id;
					// When you create the mailing list, go through and create contacts from the JSON Array
					var options = {				
						columns: true
					}
					var file = req.files.xlsFile.path;
					
					csvjs.parseCsv(file, function(error, json, stats) {
						var i = 0;
						var stats = JSON.stringify(stats);
						var list = JSON.stringify(json);
						console.log('============= STATS =============');
						console.log(stats);
						if(error) {
							console.log(error)
						} else {
							list = list.replace(/first name/ig, 'firstName');
							list = list.replace(/last name/ig, 'lastName');
							list = list.replace(/spouse firstname/ig, 'spouseFirstName');
							list = list.replace(/envelope line/ig, 'envLine');
							list = list.replace(/address 1/ig, 'addressOne');
							list = list.replace(/address 2/ig, 'addressTwo');
							list = list.replace(/address 3/ig, 'addressThree');
							list = list.replace(/greeting/ig, 'greeting');
							list = list.replace(/city/ig, 'city');
							list = list.replace(/state/ig, 'state');
							list = list.replace(/zip/ig, 'zip');
							list = list.replace(/country/ig, 'country');
							
							var result = JSON.parse(list);

							for (contact in result) {

								if (underscore_.isEmpty(result[contact])) {
									// Do Nothing
								} else {
									var contactInfo = {
										mailingList: id,
										firstName: result[contact].firstName,
										lastName: result[contact].lastName,
										spouseFirstName: result[contact].spouseFirstName,
										envelopeLine: result[contact].envLine,
										addressOne: result[contact].addressOne,
										addressTwo: result[contact].addressTwo,
										addressThree: result[contact].addressThree,
										greeting: result[contact].greeting,
										city: result[contact].city,
										state: result[contact].state,
										postCode: result[contact].zip,
										country: result[contact].country
									};

									var Contact = keystone.list('Contact').model,
										newContact = new Contact(contactInfo);

									newContact.save(function(err) {});
								}

							}
							
						}
							
					});
					
				});

				res.redirect('/mailing-lists');
			
			},
			
		], function(err){
			
			if (err) return err;

		});

	} else {

		// Render the view
		// console.log(req.session.uploadMyOwn)
		keystone.list('Mailing Lists').model.find().where('uploadedBy', req.user._id).exec(function(err, lists) {
			if (lists <= 0 && req.session.uploadMyOwn != true && req.user.noCRM != true) {
				req.session.uploadMyOwn = true;
				view.render('CRM/noLists');
			} else {
				view.render('CRM/mailingListIndex');
			}
		});

	}

};
