var keystone = require('keystone'),
	Types = keystone.Field.Types,
  sparkpost = require('sparkpost'),
  client = new sparkpost(process.env.SPARKPOST_SECRET_KEY),
  EmailTemplate = require('email-templates').EmailTemplate,
  path = require('path');

var html = path.resolve(__dirname, '../..', 'templates', 'emails', 'email-reset');

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Postcards', {
	nocreate: false,
	noedit: true
});

var deps = {
	customReturnAddress: { 'customReturnAddress': true },
	PLS: { 'customReturnAddress': false }
}

Enquiry.add({
	}, 'Submitted By', {
		name: { type: Types.Name },
		submittedOn: { type: Date, default: Date.now },
	}, 'Letter Details', {
		cardstock: { type: String },
		sizeOfPaper: { type: String },
		printerOption: { type: String },
	}, 'Letter Files', {
		fileOne: { type: String },
		fileTwo: { type: String },
		fileThree: { type: String },
		fileFour: { type: String },
	}, 'Special Instructions', {
		personalization: { type: String },
		specialInstructions: { type: String },
	}, 'Mailing List', {
		mailingList: { type: Types.Relationship, ref: 'Mailing Lists', many: true },
		listChoice: { type: String, label: 'Custom Mailing List'},
	}, 'Return Address', {
		customReturnAddress: { type: Boolean },
		returnAddress: { type: Types.Location, dependsOn: deps.customReturnAddress },
		prayerLetterServiceReturnAddress: { type: Boolean, dependsOn: deps.PLS, default: true },
		yourMinistryUpdateFrom: { type: String, dependsOn: deps.PLS }

});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function() {

  var $enquiry = this;

  var template = new EmailTemplate(html),
    data = {
      name: $enquiry.name.first,
      message: "<p class='text-larger'>"+$enquiry.name.first+" just submitted a new order.</p><p><b>Name:</b> "+$enquiry.name.first+"</p><p><b>Sent:</b> "+$enquiry.submittedOn+"</p><p><a href='http://www.myletterservice.org/keystone/brochures/'"+$enquiry._id+">Open in Keystone</p>"
    }

  template.render(data, function(err, res) {

    client.transmissions.send({
      transmissionBody: {
        content: {
          from: "contact@mail.myletterservice.org",
          subject: $enquiry.name + " submitted a new order for Postcards"
          html: res.html
        },
        recipients: [{address: process.env.ALERT_EMAIL}]
      }
    }, function(err, res) {});

  });

}

Enquiry.defaultSort = '-submittedOn';
Enquiry.defaultColumns = 'name, submittedOn';
Enquiry.register();
