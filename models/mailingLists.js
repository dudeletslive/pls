var keystone = require('keystone'),
    Types = keystone.Field.Types,
    sparkpost = require('sparkpost'),
    client = new sparkpost(process.env.SPARKPOST_SECRET_KEY),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path');

var ObjectID = require('mongodb').ObjectId;


var html = path.resolve(__dirname, '..', 'templates', 'emails', 'email-reset');

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
  uploadedBy: { type: Types.Relationship, ref: 'User', many: true },
  prettyName: { type: String, label: 'List Name' },
  contacts: { type: Types.Relationship, ref: 'Contact', many: true }
});

/**
 * Relationships
 */

mailingList.schema.pre('save', function(next) {
  this.wasNew = this.isNew;
  next();
})

mailingList.schema.post('save', function() {
  if (this.wasNew) {
    this.sendNotificationEmail();
  }
});

mailingList.schema.methods.sendNotificationEmail = function() {

  var $list = this;

  keystone.list('User').model.findOne({_id: new ObjectID($list.userID)}).exec(function(err, user) {

    var template = new EmailTemplate(html),
        data = {
          name: user.name.first,
          message: "<p class='text-larger'>A new mailing list was just uploaded.</p><p><a href='http://www.myletterservice.org/keystone/mailing-lists/"+$list._id+"'>Open in Keystone</p>"
        }

    template.render(data, function(err, res) {

      client.transmissions.send({
        transmissionBody: {
          content: {
            from: "contact@mail.myletterservice.org",
            subject: user.name.first + " just uploaded a new mailing list",
            html: res.html
          },
          recipients: [{address: "daniel@theoryandpractice.co"}]
        }
      }, function(err, res) {});

    });

  });
 
}


/**
 * Registration
 */

mailingList.defaultColumns = 'uploadedBy, prettyName';
mailingList.register();