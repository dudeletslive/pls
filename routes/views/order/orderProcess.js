var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.formData = req.body || {};
	locals.validationErrors = {};

	locals.mailerType = req.query.mailer;
	locals.form = req.session.formData;

	var result = locals.mailerType.replace( /([A-Z])/g, " $1" );
	locals.finalResult = result.charAt(0).toUpperCase() + result.slice(1);


	console.log(locals.form);

	User.model.findById(req.session.userId).exec(function(err, user) {

		if (err) {
			return next(err);
		}

		req.user = user;

	});

	view.query('lists', keystone.list('Mailing Lists').model.find().where('uploadedBy', req.user._id).sort('sortOrder'));
	
	// Render the view
	view.render('order/orderProcess');
};
