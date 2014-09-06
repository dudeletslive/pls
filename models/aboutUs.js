var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * BIO
 * =====
 */

var Bio = new keystone.List('About Us Bio', {
	label: 'About Us Bio',
	plural: 'About Us Bio',
	singular: 'About Us Bio',
	sortable: { initiate: true },
});

Bio.add({
	leftColumn: { type: Types.Html, wysiwyg: true, note: 'These fields will retain styles from their if they are copy + pasted in to the text editor.' },
	rightColumn: { type: Types.Html, wysiwyg: true, note: 'These fields will retain styles from their if they are copy + pasted in to the text editor.' }
});



/**
 * Relationships
 */



/**
 * Registration
 */

Bio.defaultColumns = 'name';
Bio.register();
