Accounts.onCreateUser(function (options, user) {
    var userProperties = {
        profile: options.profile || {}
    };
    user = _.extend(user, userProperties);

    var userManager = new UserManager(user);

    if (options.email)
        user.profile.email = options.email;



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
    user.slug = _.slugify(userManager.getUserName());

    return user;
});





Meteor.methods({
    changeEmail: function (newEmail) {
        Meteor.users.update(Meteor.userId(), {$set: {emails: [
            {address: newEmail}
        ]}});
    },


    setEmailHash: function (user) {
        var email_hash = CryptoJS.MD5(getEmail(user).trim().toLowerCase()).toString();
        Meteor.users.update(user._id, {$set: {email_hash: email_hash}});
    }
});