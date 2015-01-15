var keystone = require('keystone'),
	Enquiry = keystone.list('Prayer Letters'),
	Two = keystone.list('Postcards'),
	Three = keystone.list('Brochures'),
	Four = keystone.list('Fund Appeals'),
	Five = keystone.list('Thank You Letters'),
	Six = keystone.list('Christmas Letters');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.tabID = 'summary';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	locals.sessionType = req.query.mailerType;

	req.session.formData = req.body;

	console.log(req.body);
	
	if (locals.mailerType != 'brochures') {
		var string = req.body.list;
		var array = string.split(',');
		for (i=0; i < array.length; i++){
			view.query('list-' + [i] + '', keystone.list('Mailing Lists').model.findById(req.body.list).sort('sortOrder'));
			console.log('list-' + [i] + '');
		}
		locals.form = req.body;
	} else {
		locals.form = req.body;
	}

	view.on('post', {action: 'prayerLetter'}, function(next) {
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, listChoice, specialInstructions, customReturnAddress, returnAddress, insertOne.isConfigured, insertTwo.isConfigured, insertThree.isConfigured, insertOne.insertType, insertTwo.insertType, insertThree.insertType, insertOne.paperChoice, insertOne.printerOption, insertTwo.paperChoice, insertTwo.printerOption, yourMinistryUpdateFrom, prayerLetterServiceReturnAddress',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				res.redirect('/confirmation');
			}
		});
		
	});

	view.on('post', {action: 'postcards'}, function(next) {

		console.log('This is a postcard');

		var newEnquiry = new Two.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, cardstock, sizeOfPaper, printerOption, fileOne, fileTwo, fileThree, fileFour, mailingList, listChoice,specialInstructions, customReturnAddress, returnAddress, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				res.redirect('/confirmation');
			}
		});
		
	});

	view.on('post', {action: 'brochures'}, function(next) {

		console.log('This is brochures');

		var newEnquiry = new Three.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfBrochuresNeeded, shipTheOrderTo, printerOption, fileOne, fileTwo, fileThree, fileFour, mailingList, listChoice, specialInstructions, customReturnAddress, returnAddress, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				res.redirect('/confirmation');
			}
		});
		
	});

	view.on('post', {action: 'fundAppeal'}, function(next) {

		console.log('This is fundAppeals');

		var newEnquiry = new Four.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, personalization, multipleLists, listChoice, noLogo, addressService, specialInstructions, customReturnAddress, returnAddress, yourMinistryUpdateFrom, insertOne.isConfigured, insertTwo.isConfigured, insertThree.isConfigured, insertOne.insertType, insertTwo.insertType, insertThree.insertType, insertOne.paperChoice, insertOne.printerOption, insertTwo.paperChoice, insertTwo.printerOption',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				res.redirect('/confirmation');
			}
		});
		
	});
	
	view.on('post', {action: 'thankYou'}, function(next) {

		console.log('This is thankYou');

		var newEnquiry = new Five.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, shipTheOrderTo, oneTime, mailingList, specialInstructions, customReturnAddress, listChoice, returnAddress, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				res.redirect('/confirmation');
			}
		});
		
	});

	view.on('post', {action: 'christmasLetter'}, function(next) {

		console.log('This is christmasLetter');

		var newEnquiry = new Six.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, specialInstructions, oneTime, personalization, noLogo, addressService, customReturnAddress, returnAddress, insertOne.isConfigured, insertTwo.isConfigured, listChoice, insertThree.isConfigured, insertOne.insertType, insertTwo.insertType, insertThree.insertType, insertOne.paperChoice, insertOne.printerOption, insertTwo.paperChoice, insertTwo.printerOption, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
				next();
			} else {
				locals.enquirySubmitted = true;
				res.redirect('/confirmation');
			}
		});
		
	});

	// Render the view
	// if (typeof req.session.letterDetails === 'undefined') {
	// 	if (locals.sessionType) {
	// 		req.flash('error', 'Please fill out all parts of the order form before attempting to view your order summary.');
	// 		res.redirect('/letter-details?mailer=' + locals.sessionType);
	// 	} else {
	// 		req.flash('error', 'Please fill out all parts of the order form before attempting to view your order summary.');
	// 		res.redirect('/order');
	// 	}
	// } else {
	// 	view.render('order/summary');
	// }
	view.render('order/summary');
};
