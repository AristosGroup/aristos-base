UserManager = function (user) {
    this.user = user;

};

UserManager.prototype = {

    getUserSetting: function (setting, defaultValue) {
        var user = this.user;
        var defaultValue = (typeof defaultValue == "undefined") ? null : defaultValue;
        var settingValue = getProperty(user.profile, setting);
        return (settingValue == null) ? defaultValue : settingValue;
    },

    getEmailHash: function () {
        var user = this.user;

        // todo: add some kind of salt in here
        return CryptoJS.MD5(getEmail(user).trim().toLowerCase() + user.createdAt).toString();
    },

    email: function () {
        var user = this.user;

        if (user.emails && user.emails.length) {
            return user.emails[0].address;
        } else {
            return '';
        }
    },

    getDisplayName: function () {
        var user = this.user;

        return (user.profile && user.profile.name) ? user.profile.name : user.username;
    },

    getUserName: function () {
        var user = this.user;

        var addr, email, parts;
        email = this.email();
        parts = email.split('@');
        addr = parts[0];
        return addr.charAt(0).toUpperCase() + addr.slice(1);
    },
    shortUserName: function () {
        var user = this.user;

        var parts, user_name;
        if (this.getUserName(user).indexOf('.') > 0) {
            parts = this.getUserName(user).split('.');
            user_name = parts[0].charAt(0) + parts[1].charAt(0);
            return user_name.toUpperCase();
        }
        return this.userName(user).charAt(0).toUpperCase();
    },

    getGravatar: function (options) {
        var user = this.user;


        if (!user) return '/images/avatar_default.jpg';

        var email = this.email(user);

        if (user && this.email(user)) {
            var options = options || {};

            var protocol = options.secure ? 'https' : 'http';
            delete options.secure;
            var hash = CryptoJS.MD5(this.email(user)).toString();
            var url = protocol + '://www.gravatar.com/avatar/' + hash;

            var params = _.map(options,function (val, key) {
                return key + "=" + val
            }).join('&');
            if (params !== '')
                url += '?' + params;

            return url;

        }
    },


    friendsWith: function (user_id) {
        var user = this.user;

        return _.contains(user.friendIds, user_id);
    },

    myFriend: function () {
        var user = this.user;

        return user.current().friendsWith(user._id);
    },

    getTwitterName: function () {
        var user = this.user;

        // return twitter name provided by user, or else the one used for twitter login
        if (checkNested(user, 'profile', 'twitter')) {
            return user.profile.twitter;
        } else if (checkNested(user, 'services', 'twitter', 'screenName')) {
            return user.services.twitter.screenName;
        }
        return null;
    },
    getGitHubName: function () {
        var user = this.user;

        // return twitter name provided by user, or else the one used for twitter login
        if (checkNested(user, 'profile', 'github')) {
            return user.profile.github;
        } else if (checkNested(user, 'services', 'github', 'screenName')) { // TODO: double-check this with GitHub login
            return user.services.github.screenName;
        }
        return null;
    },
    getTwitterNameById: function (userId) {
        return getTwitterName(Meteor.users.findOne(userId));
    }



};


getProperty = function (object, property) {
    // recursive function to get nested properties
    var array = property.split('.');
    if (array.length > 1) {
        var parent = array.shift();
        // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
        return (typeof object[parent] == "undefined") ? null : getProperty(object[parent], array.join('.'))
    } else {
        // else return property
        return object[array[0]];
    }
};


// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
checkNested = function (obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments),
        obj = args.shift();

    for (var i = 0; i < args.length; i++) {
        if (!obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
};

if (Meteor.isClient) {
    Deps.autorun(function(){
        if(Meteor.user()) {
            Meteor.userManager = new UserManager(Meteor.user());
        }
    });
}