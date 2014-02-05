Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

Meteor.publish('modules', function (){
    return AristosModules.find({})
});