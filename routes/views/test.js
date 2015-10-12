var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	fs = require("fs");

exports = module.exports = function(req, res) {
  
	var view = new keystone.View(req, res),
		locals = res.locals;

	if (req.method === 'POST') {

			console.log('Posted ' + JSON.stringify(req.files.xlsFile));

			var file = req.files.xlsFile.path;
			var fileName = req.files.xlsFile.name;
			var ext = fileName.split('.')[1];

			// If the file is not a CSV, run this.
			if (req.files.xlsFile.type != 'text/csv') {

				res.redirect(req.originalUrl);
				if (ext === 'xlsx' || ext === 'xlx')
					req.flash('error', 'Please make sure your file is a .CSV. Click <a href="#" data-toggle="modal" data-target="#instructions">here</a> for instructions on converting your ".' + ext + '" file to a CSV.');
				else
					req.flash('error', 'Please make sure your file is a .CSV.')

			// If it's not an Excel file, run this.
			} else {

				var options = {
					// objectMode: true,
					columns: true
				}
				var csv_trans = cv2json.csv(file, options, function(err, result) {
					if(err)
						console.error(err);
					else 
						console.log(result);
				});

			}

	} else {

		view.render('testCSV');

	}
  
};
