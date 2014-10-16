var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	fs = require('fs');

exports = module.exports = function(req, res) {
  
	var view = new keystone.View(req, res),
		locals = res.locals;

		fs.writeFile("/tmp/test", "TEST", function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		}); 
  
	view.render('testCSV');
  
};
