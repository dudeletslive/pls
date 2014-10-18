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

	locals.letterDetails = req.session.letterDetails;
	locals.mailingList = req.session.mailingList;
	locals.mailerType = req.query.mailer;
	locals.sessionType = req.session.mailerType;

	// Part Three of formData
	req.session.returnAddress = locals.formData;
	locals.returnAddress = req.session.returnAddress;

	if (locals.mailerType != 'brochures') {
		view.query('list', keystone.list('Mailing Lists').model.findById(req.session.mailingList.list).sort('sortOrder'));
	} else {
		locals.letterDetails = req.body;
	}

	view.on('post', {action: 'prayerLetter'}, function(next) {
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, listChoice, specialInstructions, customReturnAddress, returnAddress, insertOne.isConfigured, insertTwo.isConfigured, insertThree.isConfigured, insertOne.paperChoice, insertOne.printerOption, insertTwo.paperChoice, insertTwo.printerOption, yourMinistryUpdateFrom',
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
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, personalization, multipleLists, listChoice, noLogo, addressService, specialInstructions, customReturnAddress, returnAddress, yourMinistryUpdateFrom',
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
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, specialInstructions, oneTime, personalize, noLogo, addressService, customReturnAddress, returnAddress, insertOne.isConfigured, insertTwo.isConfigured, listChoice, insertThree.isConfigured, insertOne.paperChoice, insertOne.printerOption, insertTwo.paperChoice, insertTwo.printerOption, yourMinistryUpdateFrom',
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
