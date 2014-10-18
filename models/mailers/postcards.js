var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Postcards', {
	nocreate: false,
	noedit: true
});

var deps = {
	customReturnAddress: { 'customReturnAddress': true },
	PLS: { 'customReturnAddress': false }
}

Enquiry.add({
	}, 'Submitted By', {
		name: { type: Types.Name },
		submittedOn: { type: Date, default: Date.now },
	}, 'Letter Details', {
		cardstock: { type: String },
		sizeOfPaper: { type: String },
		printerOption: { type: String },
	}, 'Letter Files', {
		fileOne: { type: String },
		fileTwo: { type: String },
		fileThree: { type: String },
		fileFour: { type: String },
	}, 'Special Instructions', {
		personalization: { type: String },
		specialInstructions: { type: String },
	}, 'Mailing List', {
		mailingList: { type: Types.Relationship, ref: 'Mailing Lists' },
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
			to: admins,
			from: {
				name: 'Prayer Letter Service',
				email: 'contact@prayer-letter-service.com'
			},
			subject: 'New Order Processed at Prayer Letter Service',
			enquiry: object
		}, callback);
		
	});
	
}

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
