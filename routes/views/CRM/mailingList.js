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
				var JSONString = locals.obj;

				sortBy = req.query.sortBy != null ? req.query.sortBy : 'firstName';
				sortString = String(sortBy);

				locals.obj.sort(function (a, b) {
					if(a[sortString] < b[sortString]) return -1;
					if(a[sortString] > b[sortString]) return 1;
					return 0;
				});

				res.render('CRM/mailingList');
			});

	});

	// Render the view
	view.render('CRM/mailingList');
};
