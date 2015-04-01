var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Fund Appeals', {
	nocreate: false,
	noedit: true
});

var deps = {
	insertOne: { 'insertOne.isConfigured': true },
	insertTwo: { 'insertTwo.isConfigured': true },
	insertThree: { 'insertThree.isConfigured': true },
	customReturnAddress: { 'customReturnAddress': true },
	PLS: { 'customReturnAddress': false }
}

Enquiry.add({
	}, 'Submitted By', {
		name: { type: Types.Name },
		submittedOn: { type: Date, default: Date.now },
	}, 'Letter Details', {
		paperChoice: { type: String },
		numberOfPages: { type: String },
		sizeOfPaper: { type: String },
		printerOption: { type: String },
		envelopeChoice: { type: String },
		postageOption: { type: String },
	}, 'Inserts', {
		insertOne: {
			isConfigured: { type: Boolean, label: 'First Insert', default: true },
			insertType: { type: String, dependsOn: deps.insertOne },
			paperChoice: { type: String, dependsOn: deps.insertOne },
			printerOption: { type: String, dependsOn: deps.insertOne }
		},
		insertTwo: {
			isConfigured: { type: Boolean, label: 'Second Insert' },
			insertType: { type: String, dependsOn: deps.insertTwo },
			paperChoice: { type: String, dependsOn: deps.insertTwo },
			printerOption: { type: String, dependsOn: deps.insertTwo }
		},
		insertThree: {
			isConfigured: { type: Boolean, label: 'Third Insert' },
			insertType: { type: String, dependsOn: deps.insertThree },
		},
	}, 'Letter Files', {
		fileOne: { type: String },
		fileTwo: { type: String },
		fileThree: { type: String },
		fileFour: { type: String },
	}, 'Special Instructions', {
		specialInstructions: { type: String },
		personalization: { type: String },
		multipleLists: { type: Boolean, label: 'I\'ve attached multiple mailing lists to correspond with the attached letters.' },
		noLogo: { type: Boolean, label: 'Do not include a logo on my envelopes for this mailing.' },
		addressService: { type: Boolean, label: 'Please do not include "Address Service Requested" for this mailing' }
	}, 'Mailing List', {
		mailingList: { type: Types.Relationship, ref: 'Mailing Lists', many: true },
		listChoice: { type: String, label: 'Custom Mailing List'},
	}, 'Return Address', {
		customReturnAddress: { type: Boolean },
		returnAddress: { type: Types.Location, dependsOn: deps.customReturnAddress },
		prayerLetterServiceReturnAddress: { type: Boolean, dependsOn: deps.PLS, default: true },
		yourMinistryUpdateFrom: { type: String, dependsOn: deps.PLS }

});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	
	var object = this;
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		new keystone.Email('enquiry-notification').send({
			to: 'plservice@myletterservice.org',
			from: {
				name: 'Prayer Letter Service',
				email: 'contact@prayer-letter-service.com'
			},
			subject: 'New Order Processed at Prayer Letter Service',
			enquiry: object
		}, callback);
		
	});
	
}

Enquiry.defaultSort = '-submittedOn';
Enquiry.defaultColumns = 'name, submittedOn';
Enquiry.register();
