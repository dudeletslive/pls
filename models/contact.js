var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Mailing Lists
 * =====
 */

var contact = new keystone.List('Contact', {
	autokey: { path: 'slug', from: 'title', unique: true },
	map: { name: 'firstName' },
	track: { createdAt: true, createdBy: true, updatedAt: true, updatedBy: true }
	// noedit: true,
	// nocreate: true
});

contact.add({
	mailingList: { type: Types.Relationship, ref: 'Mailing Lists' },
	firstName: { type: String },
	lastName: { type: String },
	spouseFirstName: { type: String },
	greeting: { type: String },
	envelopeLine: { type: String },
	addressOne: { type: String, label: 'Address Line One' },
	addressTwo: { type: String, label: 'Address Line Two' },
	addressThree: { type: String, label: 'Address Line Three' },
	city: { type: String },
	state: { type: String },
	postCode: { type: String, label: 'Postal / Zip Code' },
	contact_id: { type: String, note: 'ID used for MPDX' },
	external_id: { type: String, note: 'ID used for MPDX' }
});



/**
 * Relationships
 */



/**
 * Registration
 */

contact.defaultColumns = 'mailingList, lastName, firstName, spouseFirstName, envelopeLine, addressOne, addressTwo, addressThree, city, state, postCode';
contact.register();
