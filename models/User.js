var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var deps = {
	facebook: { 'services.facebook.isConfigured': true },
	linkedIn: { 'services.linkedIn.isConfigured': true }
}

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String, noedit: true, hidden: false },
	userID: { type: String, noedit: true },
}, 'Address', {
	address: { type: Types.Location },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true}
}, 'Services', {
	services: {
		linkedIn: {
			isConfigured: { type: Boolean, label: 'LinkedIn has been authenticated', noedit: true },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.linkedIn, noedit: true },
			
			username: { type: String, label: 'Username', dependsOn: deps.linkedIn, noedit: true },
			avatar: { type: String, label: 'Image', dependsOn: deps.linkedIn, noedit: true },
		},
		facebook: {
			isConfigured: { type: Boolean, label: 'Facebook has been authenticated', noedit: true },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.facebook, noedit: true },
			
			username: { type: String, label: 'Username', dependsOn: deps.facebook, noedit: true },
			avatar: { type: String, label: 'Image', dependsOn: deps.facebook, noedit: true },
			
			accessToken: { type: String, label: 'Access Token', dependsOn: deps.facebook, noedit: true },
			refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.facebook, noedit: true }
		}
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.methods.resetPassword = function(callback) {
	
	var user = this;

	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	
	user.save(function(err) {
		
		if (err) return callback(err);
		
		new keystone.Email('forgotten-password').send({
			user: user,
			link: '/reset-password/' + user.resetPasswordKey,
			subject: 'Reset your password',
			to: user.email,
			from: {
				name: 'My Letter Service',
				email: 'contact@myletterservice.org'
			}
		}, callback);
		
	});
	
}

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
