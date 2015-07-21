/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore'),
  keystone = require('keystone'),
  middleware = require('./middleware'),
  importRoutes = keystone.importer(__dirname),
  aws = require('aws-sdk'),
  AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY = process.env.AWS_SECRET_KEY,
  S3_BUCKET = process.env.S3_BUCKET,
  User = keystone.list('User'),
  passport = require('passport'), 
  LinkedInStrategy = require('passport-linkedin').Strategy,
  express = require('keystone/node_modules/express'),
  oauth2orize = require('oauth2orize'),
  session     = require('cookie-session');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var server = oauth2orize.createServer();

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_API_KEY,
  clientSecret: process.env.LINKEDIN_SECRET_KEY,
  callbackURL: "http://www.myletterservice.org/authz/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  }, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // console.log(profile);
      return done(null, profile);
    });
    }
));

var routes = {
  views: importRoutes('./views'),
  auth: importRoutes('./auth'),
  api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function(app) {

  // app.use(session({secret: 'prayerletterservice'}));

  // app.use(express.cookieSession());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // app.use(function(req, res, next) {
  //   if(!req.secure) {
  //     return res.redirect(['https://', req.get('Host'), req.url].join(''));
  //   }
  //   next();
  // });

  // LinkedIn oAuth2
  app.get('/authz/linkedin', passport.authenticate('linkedin', { state: 'auth'  }));
  app.get('/authz/linkedin/callback', 
      passport.initialize(),
      passport.authenticate('linkedin'),
      function(req, res) {
        var userJSON = req.user._json;
        var auth = {

          type: 'linkedIn',
          
          name: {
            first: userJSON.firstName,
            last: userJSON.lastName
          },
          
          email: userJSON.emailAddress.length ? userJSON.emailAddress : null,
          
          profileId: userJSON.id,
          
          username: userJSON.formattedName,
          avatar: userJSON.pictureUrl,
          
          // accessToken: data.accessToken,
          // refreshToken: data.refreshToken

        }
      
        req.session.auth = auth;
        res.redirect('/confirm');
      }
    );

  // Views
  app.get('/', routes.views.index);
  app.get('/about', routes.views.about);
  app.get('/printing-services', routes.views.printing);
  app.get('/options', routes.views.options);
  app.get('/pricing', routes.views.pricing);
  app.all('/contact', routes.views.contact);

  // Super fancy way of handling account management page-
  // Based on the link, set locals, then display appropriate panel
  // On Account Management page based on which local variable is set.
  app.get('/forgot-password', routes.views.session.account);

  // User Session
  app.all('/sign-in', routes.views.session.signIn);
  app.get('/sign-out', routes.views.session.signOut);
  app.all('/forgot-password', routes.views.session.forgotPass);
  app.all('/reset-password/:key', routes.views.session.resetPass);

  // User Auth
  app.all('/auth/:service', routes.auth.service);
  app.all('/confirm', routes.auth.confirm);

  // Register
  app.all('/register', routes.views.register);
  
  // Contact List Pages
  app.all('/mailing-lists', middleware.requireUser, routes.views.CRM.mailingListIndex);
  app.all('/mailing-lists/:list', middleware.requireUser, routes.views.CRM.mailingList);
  app.all('/no-mailing-lists', middleware.requireUser, routes.views.CRM.noLists);

  // Order Process
  app.all('/old-order', middleware.requireUser, routes.views.order.begin);
  app.all('/letter-details', middleware.requireUser, routes.views.order.letterDetails);
  app.all('/mailing-list', middleware.requireUser, routes.views.order.mailingList);
  app.all('/return-address', middleware.requireUser, routes.views.order.returnAddress);
  app.all('/summary', middleware.requireUser, routes.views.order.summary);
  app.all('/confirmation', middleware.requireUser, routes.views.order.confirmation);
  app.all('/order', middleware.requireUser, routes.views.order.begin);
  app.all('/order/process', middleware.requireUser, routes.views.order.orderProcess);
  
  //My Account
  app.all('/my-account', middleware.requireUser, routes.views.session.myAccount);

  // API Routes
  app.get('/api/v1/contacts', keystone.middleware.api, routes.api.contacts.list);
  app.put('/api/v1/contacts', keystone.middleware.api, routes.api.contacts.create);
  app.post('/api/v1/contacts', keystone.middleware.api, routes.api.contacts.new);
  app.delete('/api/v1/contacts/:id', keystone.middleware.api, routes.api.contacts.remove);
  // app.all('/api/v1/mailing-lists/list', keystone.initAPI, routes.api.mailingLists.list);

  // MPDX Auth
  app.all('/oauth/authorize', middleware.requireUser, routes.auth.mpdx);
  app.all('/oauth/token', routes.auth.token);
  
  // app.all('/oauth/authorize',
  //  server.authorize(function(clientID, redirectURI, done) {
  //    // Nothing to do here, move along.
  //  }),
  //  function(req, res) {
  //    view.render('auth/mpdx', { 
  //      transactionID: req.oauth2.transactionID,
  //      user: req.user, 
  //      client: req.oauth2.client 
  //    });
  //  });

  // Test CSV
  app.all('/test', routes.views.test);
  app.get('/sign_s3', function(req, res){
      aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
      var s3 = new aws.S3();
      var s3_params = {
          Bucket: S3_BUCKET,
          Key: req.query.s3_object_name,
          ContentType: req.query.s3_object_type,
          ACL: 'public-read'
      };
      s3.getSignedUrl('putObject', s3_params, function(err, data){
          if(err){
              console.log(err);
          }
          else{
              var return_data = {
                  signed_request: data,
                  url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.s3_object_name
              };
              res.write(JSON.stringify(return_data));
              res.end();
          }
      });
  });

  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);
  
};
