var keystone = require('keystone'),
	Enquiry = keystone.list('Prayer Letters'),
	Two = keystone.list('Postcards'),
	Three = keystone.list('Brochures');

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

	locals.sessionType = req.session.mailerType;

	// Part Three of formData
	req.session.returnAddress = locals.formData;
	locals.returnAddress = req.session.returnAddress;

	view.on('post', {action: 'prayerLetter'}, function(next) {
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfPages, sizeOfPaper, printerOption, envelopeChoice, postageOption, fileOne, fileTwo, fileThree, fileFour, mailingList, specialInstructions, customReturnAddress, returnAddress, insertOne.isConfigured, insertTwo.isConfigured, insertThree.isConfigured, insertOne.paperChoice, insertOne.printerOption, insertTwo.paperChoice, insertTwo.printerOption, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});

	view.on('post', {action: 'postcards'}, function(next) {

		console.log('This is a postcard');

		var newEnquiry = new Two.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, cardstock, sizeOfPaper, printerOption, file, mailingList, specialInstructions, customReturnAddress, returnAddress, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});

	view.on('post', {action: 'brochures'}, function(next) {

		console.log('This is brochures');

		var newEnquiry = new Three.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, paperChoice, numberOfBrochuresNeeded, shipTheOrderTo, printerOption, file, mailingList, personalization, specialInstructions, customReturnAddress, returnAddress, yourMinistryUpdateFrom',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});
	
	// Render the view
	view.render('order/summary');
};
