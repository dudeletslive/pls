var keystone = require('keystone'),
		Types = keystone.Field.Types,
	  sparkpost = require('sparkpost'),
	  client = new sparkpost(process.env.SPARKPOST_SECRET_KEY),
	  EmailTemplate = require('email-templates').EmailTemplate,
	  path = require('path');

var html = path.resolve(__dirname, '..', 'templates', 'emails', 'email-reset');

/**
 * User Model
 * ==========
 */

var deps = {
	facebook: { 'services.facebook.isConfigured': true },
	linkedIn: { 'services.linkedIn.isConfigured': true },
	mpdx: { 'services.MPDX.isConfigured': true }
}

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password },
	resetPasswordKey: { type: String, hidden: true },
	userID: { type: String, noedit: false, hidden: false },
	referredBy: { type: String, noedit: true },
}, 'Address', {
	address: { type: Types.Location },
	returnAddress: { type: Types.Location },
}, 'Preferences', {
	emailInvoice: { type: Boolean, label: 'Email my invoices to me.' },
	mailInvoice: { type: Boolean, label: 'Mail my invoices to me.' },
	emailReminders: { type: Boolean, label: 'Periodically email me reminders VIA MailChimp'},
	cruStaffOrMinistryChartfield: { type: String },
	ministryUpdateFrom: { type: String, label: 'Your Ministry Update From:' },
	databaseMaintenance: { type: String, label: 'To maintain my database I would like to:' },
	mailingEnvelopeLogo: { type: String, label: 'Please include this logo on my mailing envelope:' },
	noCRM: { type: Boolean, label: 'Opted out of CRM' },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true}
}, 'Services', {
	services: {
		linkedIn: {
			isConfigured: { type: Boolean, label: 'LinkedIn has been authenticated', noedit: false },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.linkedIn, noedit: false },
			
			username: { type: String, label: 'Username', dependsOn: deps.linkedIn, noedit: false },
			avatar: { type: String, label: 'Image', dependsOn: deps.linkedIn, noedit: false },
		},
		facebook: {
			isConfigured: { type: Boolean, label: 'Facebook has been authenticated', noedit: false },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.facebook, noedit: false },
			
			username: { type: String, label: 'Username', dependsOn: deps.facebook, noedit: false },
			avatar: { type: String, label: 'Image', dependsOn: deps.facebook, noedit: false },
			
			accessToken: { type: String, label: 'Access Token', dependsOn: deps.facebook, noedit: false },
			refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.facebook, noedit: false }
		},
		MPDX: {
			isConfigured: { type: Boolean, label: 'MPDX has been configured', noedit: false },
			code: { type: String, label: 'Hide this field', hidden: true },
			clientID: { type: String, label: 'Hide this field', hidden: true },
			clientSecret: { type: String, label: 'Hide this field', hidden: true },
			accessToken: { type: String, label: 'Access Token', noedit: false, dependsOn: deps.mpdx }
		}
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

User.schema.post('save', function() {
	// if (!this.resetPasswordKey) {
	if (!this.wasNew) {
		this.sendNotificationEmail();
	}
});

User.schema.methods.sendNotificationEmail = function() {
	
	var $user = this;
	
	var template = new EmailTemplate(html),
			data = {
				name: $user.name.first,
				message: "<p class='text-larger'>"+$user.name.first+" has just updated their account preferences.</p><p><b>Name:</b> "+$user.name.first+"</p><p><b>Email:</b> "+$user.email+"</p><p><a href='http://www.myletterservice.org/keystone/users/"+$user._id+"'>Open in Keystone</p>"
			}

	template.render(data, function(err, res) {

		client.transmissions.send({
			transmissionBody: {
				content: {
					from: "contact@mail.myletterservice.org",
					subject: $user.name.first + " " + $user.name.last + " updated their profile.",
					html: res.html
				},
				// recipients: [{address: "plservice@myletterservice.org"}]
				recipients: [{address: process.env.ALERT_EMAIL}]
			}
		}, function(err, res) {});

	});

}

/* Reset Password */

User.schema.methods.resetPassword = function(cb) {

	var $user = this;

	$user.resetPasswordKey = keystone.utils.randomString([16,24]);
	
	$user.save(function(err) {
		
		if (err) return cb(err);

		var template = new EmailTemplate(html),
				data = {
					name: $user.name.first,
					message: "<p>You recently requested a link to reset your password.</p><p>Please set a new password by following the link below:</p><p><a href='http://www.myletterservice.org/reset-password/"+$user.resetPasswordKey+"'>www.myletterservice.org/reset-password/"+$user.resetPasswordKey+"</a></p>"
				}

		template.render(data, function(err, res) {
			client.transmissions.send({
				transmissionBody: {
					content: {
						from: "contact@mail.myletterservice.org",
						subject: "Password Reset Request",
						html: res.html
					},
					recipients: [{address: $user.email}]
				}
			}, function(err, res) {});
		});

	});

}

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
