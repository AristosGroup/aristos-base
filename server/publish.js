Meteor.publish('modules', function (){
   return AristosModules.find();
});