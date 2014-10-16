var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'confirmation';

	if(!req.method === 'POST') {
		req.flash('error', 'You have not yet begun your order.');
		res.redirect('/order');
	}
	console.log('Confirmation Page: ' + req.session);
	
	// Render the view
	view.render('order/confirmation');
};
