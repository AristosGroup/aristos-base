Template.aside.helpers({
    userAvatar: function () {
        var user = Meteor.user();

        return UsersManager.getGravatar(user);
    },

/*    activeRouteClass: function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function (name) {
            return Router.current().route.name === name
        });

        return active && 'active';
    },*/


    mainMenu: function() {
       var menu =  Meteor.Aristos.getMainMenu();

        menu = _.map(menu, function(item) {
            if(Router.current().route.name===item.key)
            item.class='active';
            return item;
        });

        return menu;
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