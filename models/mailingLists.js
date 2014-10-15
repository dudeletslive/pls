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
	uploadedBy: { type: Types.Relationship, ref: 'User' },
	prettyName: { type: String, label: 'List Name' },
	contacts: { type: Types.Relationship, ref: 'Contact', many: true }
});

/**
 * Relationships
 */



/**
 * Registration
 */

mailingList.defaultColumns = 'uploadedBy, prettyName';
mailingList.register();
