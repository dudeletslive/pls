var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {
  
	var view = new keystone.View(req, res),
		locals = res.locals;

	if (req.method === 'POST') {
		console.log('Posted ' + req.files.xlsFile);
	}
  
	view.render('testCSV');
  
};
