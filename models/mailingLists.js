var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Mailing Lists
 * =====
 */

var mailingList = new keystone.List('Mailing Lists', {
	noedit: true,
	nocreate: true
});

mailingList.add({
});



/**
 * Relationships
 */



/**
 * Registration
 */

mailingList.defaultColumns = 'name';
mailingList.register();
