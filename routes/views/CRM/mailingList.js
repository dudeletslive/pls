var keystone = require('keystone'),
	mailingList = keystone.list('Mailing Lists');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'mailingList';

	locals.filters = {
		list: req.params.list
	};

	view.on('init', function(next) {

		mailingList.model.findOne()
			.where('slug', locals.filters.list)
			.exec(function(err, list) {
				locals.list = list;

				// Convert CSV String to JSON Object
				locals.obj = JSON.parse(list.csvJSON);

				console.log(locals.obj);

				for (key in locals.obj) { 
					console.log('Last Name' + key);
				}

				res.render('CRM/mailingList');
			});

	});

	// Render the view
	view.render('CRM/mailingList');
};
