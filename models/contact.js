var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Mailing Lists
 * =====
 */

var contact = new keystone.List('Contact', {
	autokey: { path: 'slug', from: 'title', unique: true },
	map: { name: 'firstName' }
	// noedit: true,
	// nocreate: true
});

contact.add({
	mailingList: { type: Types.Relationship, ref: 'Mailing Lists' },
	firstName: { type: String },
	lastName: { type: String },
	ENV_LINE: { type: String },
	addressOne: { type: String, label: 'Address Line One' },
	addressTwo: { type: String, label: 'Address Line Two' },
	addressThree: { type: String, label: 'Address Line Three' },
	city: { type: String },
	state: { type: String },
	postCode: { type: String, label: 'Postal / Zip Code' }
});



/**
 * Relationships
 */



/**
 * Registration
 */

contact.defaultColumns = 'id, mailingList, lastName, ENV_LINE, addressOne, addressTwo, addressThree, city, state, postCode';
contact.register();
