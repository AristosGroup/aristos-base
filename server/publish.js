Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

Meteor.publish(null, function (){
    return Sections.find({})
});