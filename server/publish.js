Meteor.startup(function () {

Meteor.publish('modules', function (){
    return AristosModules.find({})
});
});