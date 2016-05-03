var keystone = require('keystone'),
		Types = keystone.Field.Types,
	  sparkpost = require('sparkpost'),
	  client = new sparkpost(process.env.SPARKPOST_SECRET_KEY),
	  EmailTemplate = require('email-templates').EmailTemplate,
	  path = require('path');

var html = path.resolve(__dirname, '..', 'templates', 'emails', 'email-reset');

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now }
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
      message: "<p class='text-larger'>"+$enquiry.name.first+" just contacted you.</p><p><b>Name:</b> "+$enquiry.name.first+"</p><p><b>Email:</b> "+$enquiry.email+"</p><p><a href='http://www.myletterservice.org/keystone/enquiries/'"+$enquiry._id+">Open in Keystone</p>"
    }

  template.render(data, function(err, res) {

    client.transmissions.send({
      transmissionBody: {
        content: {
          from: "contact@mail.myletterservice.org",
          subject: $enquiry.name + " says hi!",
          html: res.html
        },
        // recipients: [{address: "plservice@myletterservice.org"}]
        recipients: [{address: process.env.ALERT_EMAIL}]
      }
    }, function(err, res) {});

  });

}

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();