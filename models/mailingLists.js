var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Mailing Lists
 * =====
 */

var mailingList = new keystone.List('Mailing Lists', {
	autokey: { path: 'slug', from: 'title', unique: true },
	noedit: true,
	nocreate: true
});

mailingList.add({
	userID: {type: String},
	listName: {type: String},
	csvJSON: {type: String}
});



/**
 * Relationships
 */



/**
 * Registration
 */

mailingList.defaultColumns = 'name';
mailingList.register();
