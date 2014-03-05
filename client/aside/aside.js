Template.aside.helpers({
    userAvatar: function () {
        console.log('Получение аватара пользователя');
        if(user = Meteor.user()) {
            return  Meteor.userManager.getGravatar();
        } else {
            return null;
        }
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