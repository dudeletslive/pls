var keystone = require('keystone'),
	Enquiry = keystone.list('Enquiry'),
	fs = require('fs');

exports = module.exports = function(req, res) {
  
	var view = new keystone.View(req, res),
		locals = res.locals;

		fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
			if (err) return console.log(err);
			console.log('Hello World > helloworld.txt');
		});

		fs.readdir();
  
	view.render('testCSV');
  
};
