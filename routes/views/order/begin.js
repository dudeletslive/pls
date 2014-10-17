var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'order';

	// console.log(req.session);

	req.flash('info', 'While we are smoothing out the ordering process, you may find it easiest to email your order to us. If you do upload an order, expect an email confirmation within the next business day. If you do not receive a confirmation email from us, please let us know. Thanks for your patience during this transition!')
	
	// Render the view
	view.render('order/begin');
};
