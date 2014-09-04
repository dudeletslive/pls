var keystone = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var Team = new keystone.List('Team Members', {
	sortable: { initiate: true },
});

Team.add({
	photo: { type: Types.CloudinaryImage },
	name: { type: Types.Name, required: true, index: true, initial: true },
	description: { type: Types.Textarea, required: false, index: true },
});



/**
 * Relationships
 */



/**
 * Registration
 */

Team.defaultColumns = 'name';
Team.register();
