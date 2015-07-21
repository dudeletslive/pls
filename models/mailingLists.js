var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Mailing Lists
 * =====
 */

var mailingList = new keystone.List('Mailing Lists', {
	autokey: { path: 'slug', from: 'listName', unique: true },
	map: { name: 'listName', noedit: true }
});

mailingList.add({
	userID: { type: String, hidden: true },
	listName: { type: String, hidden: true },
	uploadedBy: { type: Types.Relationship, ref: 'User', many: true },
	prettyName: { type: String, label: 'List Name' },
	contacts: { type: Types.Relationship, ref: 'Contact', many: true }
});

/**
 * Relationships
 */

mailingList.schema.post('save', function() {
	this.sendNotificationEmail();
});

mailingList.schema.methods.sendNotificationEmail = function(callback) {
	
	var object = this;

	console.log(object);
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		new keystone.Email('new-mailingList').send({
			to: 'plservice@myletterservice.org',
			from: {
				name: 'Prayer Letter Service',
				email: 'contact@myletterservice.com'
			},
			subject: 'A new Mailing List has been Uploaded',
			enquiry: object
		}, callback);
		
	});
	
}

/**
 * Registration
 */

mailingList.defaultColumns = 'uploadedBy, prettyName';
mailingList.register();
