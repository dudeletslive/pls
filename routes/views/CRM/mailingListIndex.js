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

	// Find Current User to Base lists loaded on
	User.model.findById(locals.user.id).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});

	view.query('lists', keystone.list('Mailing Lists').model.find().where('userID', locals.user.id).sort('sortOrder'));

	/*

	*/

	view.on('post', function(next) {

		console.log('Posted ' + JSON.stringify(req.files.xlsFile));

		var file = req.files.xlsFile.path;
		var fileName = req.files.xlsFile.name;
		var ext = fileName.split('.')[1];

		console.log(fileName);

		locals.fileType = ext;

		// If the file is not a CSV, run this.
		if (req.files.xlsFile.type.indexOf('csv') === -1 || req.files.xlsFile.type.indexOf('text') === -1) {

			res.redirect(req.originalUrl);
			if (ext === 'xlsx' || ext === 'xlx')
				req.flash('error', 'Please make sure your file is a .CSV. Click <a href="#" data-toggle="modal" data-target="#instructions">here</a> for instructions on converting your .' + ext + ' file to a CSV.');
			else
				req.flash('error', 'Please make sure your file is a .CSV.')
			return false;

		// If it's a CSV file, run this.
		}

		console.log(fileName + ext);

		async.series([
			
			function(cb) {
				
				if (!req.body.listName) {
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
						console.log('============= LIST =============');
						// console.log(list);
						console.log('============= STATS =============');
						// console.log(stats);
						if(error)
							console.log(error)
						else
							list = list.replace(/(\w+([^spouse])\s|\s)?first(\/*|\s*|-*|_*)?(given\s)?(name)?/ig, 'firstName');
							list = list.replace(/(\w+([^spouse])\s|\s)?(last|maiden)(\/*|\s*|-*|_*)?((family|maiden)\s)?(name)?/ig, 'lastName');
							list = list.replace(/(\w+\s|\s)?(env|envelope)(\/*|\s*|-*|_*)?(line(\sone)?)(_*|\s*)?(1|one)?/ig, 'ENV_LINE');
							list = list.replace(/(\w+\s+|\s)*?(address|street|road)(\s*|-*|_*)?((\s)address|one|1)?((\s)?-*|\r|\\r|\n|\\n)?/ig, 'addressOne');
							// list = list.replace(/(\w+\s+|\s)*?(address|street|road)(\s*|-*|_*)?((\s)two|2)((\s)?-*|\r|\\r|\n|\\n)?/ig, 'addressTwo');
							// list = list.replace(/(\w+\s+|\s)*?(address|street|road)(\s*|-*|_*)?((\s)three|3)((\s)?-*|\r|\\r|\n|\\n)?/ig, 'addressThree');
							list = list.replace(/(\w+\s+|\s)*?(city|suburb|province)(\s*|-*|_*)?(\s*|-*)?/ig, 'city');
							list = list.replace(/(\w+\s+|\s)*?(state|\b\s?st\b)(\s*|-*|_*)?(\w+\s*|-*)?/ig, 'state');
							list = list.replace(/(\w+\s+|\s)*?(post(al)?|zip)(\s*|-*)?(code)?(\s*|-*|\r|\\r|\\n)?/ig, 'zip');
							
							var result = JSON.parse(list);

							console.log('============= RESULT =============')
							// console.log(result);

							for (contact in result) {

								if (underscore_.isEmpty(result[contact])) {
									// Do Nothing
								} else {
									var contactInfo = {
										mailingList: id,
										firstName: result[contact].firstName,
										lastName: result[contact].lastName,
										ENV_LINE: result[contact].ENV_LINE,
										addressOne: result[contact].addressOne,
										addressTwo: result[contact].addressTwo,
										addressThree: result[contact].addressThree,
										city: result[contact].city,
										state: result[contact].state,
										postCode: result[contact].zip
									};

									var Contact = keystone.list('Contact').model,
										newContact = new Contact(contactInfo);

									newContact.save(function(err) {});
								}

							}
							
					});

					if(!req.body.redirect) {
						res.redirect(req.originalUrl);
					} else {	
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
