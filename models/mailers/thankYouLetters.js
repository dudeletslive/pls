var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Thank You Letters', {
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
		paperChoice: { type: String },
		postageOption: { type: String },
	}, 'Thank You Letter Files', {
		fileOne: { type: String },
		fileTwo: { type: String },
		fileThree: { type: String },
		fileFour: { type: String },
	}, 'Special Instructions', {
		shipTheOrderTo: { type: Types.Location },
		specialInstructions: { type: String },
	}, 'Mailing List', {
		oneTime: { type: String },
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
