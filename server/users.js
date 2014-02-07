Accounts.onCreateUser(function (options, user) {
    var userProperties = {
        profile: options.profile || {}
    };
    user = _.extend(user, userProperties);

    if (options.email)
        user.profile.email = options.email;

    if (getEmail(user))
        user.email_hash = getEmailHash(user);

    if (!user.profile.name)
        user.profile.name = user.username;

    // set notifications default preferences
    user.profile.notifications = {
        users: false,
        reports: false,
        comments: true,
        replies: true
    };

    // create slug from username
    user.slug = _.slugify(getUserName(user));


    // if user has already filled in their email, add them to MailChimp list
    /*    if(user.profile.email)
     addToMailChimpList(user);*/

    // send notifications to admins
    /*    var admins = Meteor.users.find({isAdmin: true});
     admins.forEach(function(admin){
     if(getUserSetting('notifications.users', false, admin)){
     var notification = getNotificationContents({
     event: 'newUser',
     properties: {
     username: getUserName(user),
     profileUrl: getProfileUrl(user)
     },
     userId: admin._id
     }, 'email');
     sendNotification(notification, admin);
     }
     });*/


    return user;
});


getEmailHash = function (user) {
    // todo: add some kind of salt in here
    return CryptoJS.MD5(getEmail(user).trim().toLowerCase() + user.createdAt).toString();
};


Meteor.methods({
    changeEmail: function (newEmail) {
        Meteor.users.update(Meteor.userId(), {$set: {emails: [
            {address: newEmail}
        ]}});
    },

    testEmail: function () {
        Email.send({from: 'test@test.com', to: getEmail(Meteor.user()), subject: 'Telescope email test', text: 'lorem ipsum dolor sit amet.'});
    },

    setEmailHash: function (user) {
        var email_hash = CryptoJS.MD5(getEmail(user).trim().toLowerCase()).toString();
        Meteor.users.update(user._id, {$set: {email_hash: email_hash}});
    }
});