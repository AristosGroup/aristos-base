Meteor.startup(function () {
    if (Meteor.roles.find().count() == 0) {
        Roles.createRole('admin');
        Roles.createRole('manage');
        Roles.createRole('view');
        Roles.createRole('view-secret');
    }


    if (Meteor.users.findOne("gs6ujsRvAD2jS57mu"))
        Roles.addUsersToRoles("gs6ujsRvAD2jS57mu", ['admin']);


    if (Meteor.users.findOne("jQJGBNo4gDw6gDE8X"))
        Roles.addUsersToRoles("jQJGBNo4gDw6gDE8X", ['admin']);

});