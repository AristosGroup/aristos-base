//Хак для получения пользователя на стороне сервера
Meteor.publish(null, function() {
    Aristos.currentUserId = this.userId;
});

Meteor.publish('modules', function (){
   return AristosModules.find();
});