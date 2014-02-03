Meteor.startup(function () {
    if (Meteor.roles.find().count() == 0) {
        Roles.createRole('admin');
        Roles.createRole('manage');
        Roles.createRole('view');
        Roles.createRole('view-secret');
    }
});