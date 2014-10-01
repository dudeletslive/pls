var keystone = require('keystone')
	List = keystone.list('Mailing Lists'),
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
	User.model.findById(req.session.userId).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});

	view.query('lists', keystone.list('Mailing Lists').model.find().where('userID', req.user.userID).sort('sortOrder'));

	view.on('post', function(next) {

		async.series([
			
			function(cb) {
				
				if (!req.body.listName || !req.body.csvJSON || !req.body.mailingList || !req.body.userID) {
					locals.errors = true;
					return cb(true);
				}
				
				return cb();
				
			},
			
			function(cb) {

				var mailingList = {
					userID: req.body.userID,
					listName: req.body.listName,
					csvJSON: req.body.csvJSON
				};
				
				var List = keystone.list('Mailing Lists').model,
					newList = new List(mailingList);

				newList.save(function(err) {
					res.redirect('/mailing-lists');
					req.flash('success', 'Your new mailing list was created successfully. You can edit it below.')
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
