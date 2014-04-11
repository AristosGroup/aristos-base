Template.aside.helpers({
    userAvatar: function () {
        var user = Meteor.user();
        if(!user || !Meteor.userManager) return '/images/avatar_default.jpg';
        return Meteor.userManager.getGravatar();
    }
});


Template.aside.events({
    'click #toggle-nav': function (e) {
        e.preventDefault();
        $('#nav').toggleClass('nav-vertical');

    },
    'click a.logout': function (e) {
        e.preventDefault();
        Meteor.logout();
    }
});