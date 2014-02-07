
getUserName = function(user){
  return user.username || getProperty(user, 'services.twitter.screenName');
}
getDisplayName = function(user){
  return (user.profile && user.profile.name) ? user.profile.name : user.username;
}
getDisplayNameById = function(userId){
  return getDisplayName(Meteor.users.findOne(userId));
}
getProfileUrl = function(user) {
  return Meteor.absoluteUrl()+'users/' + _.slugify(getUserName(user));
}
getProfileUrlById = function(id){
  return Meteor.absoluteUrl()+'users/'+ id;
}
getProfileUrlBySlug = function(slug) {
  return Meteor.absoluteUrl()+'users/' + slug;
}
getTwitterName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(checkNested(user, 'profile', 'twitter')){
    return user.profile.twitter;
  }else if(checkNested(user, 'services', 'twitter', 'screenName')){
    return user.services.twitter.screenName;
  }
  return null;
}
getGitHubName = function(user){
  // return twitter name provided by user, or else the one used for twitter login
  if(checkNested(user, 'profile', 'github')){
    return user.profile.github;
  }else if(checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;
  }
  return null;
}
getTwitterNameById = function(userId){
  return getTwitterName(Meteor.users.findOne(userId));
}
getSignupMethod = function(user){
  if(user.services && user.services.twitter){
    return 'twitter';
  }else{
    return 'regular';
  }
}
getEmail = function(user){
  if(user.profile && user.profile.email){
    return user.profile.email;
  }else{ 
    return ''; 
  }
}
getAvatarUrl = function(user){
  if(getSignupMethod(user)=='twitter'){
    return 'http://twitter.com/api/users/profile_image/'+user.services.twitter.screenName;
  }else{
    return Gravatar.getGravatar(user, {
      d: 'http://demo.telesc.pe/img/default_avatar.png',
      s: 80
    });
  }
}
getCurrentUserEmail = function(){
  return Meteor.user() ? getEmail(Meteor.user()) : '';
}
userProfileComplete = function(user) {
  return !!getEmail(user);
}


getUserSetting = function(setting, defaultValue, user){
  var user = (typeof user == 'undefined') ? Meteor.user() : user;
  var defaultValue = (typeof defaultValue == "undefined") ? null: defaultValue;
  var settingValue = getProperty(user.profile, setting);
  return (settingValue == null) ? defaultValue : settingValue;
}
getProperty = function(object, property){
  // recursive function to get nested properties
  var array = property.split('.');
  if(array.length > 1){
    var parent = array.shift();
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] == "undefined") ? null : getProperty(object[parent], array.join('.'))
  }else{
    // else return property
    return object[array[0]];
  }
};


// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
checkNested = function(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments),
        obj = args.shift();

    for (var i = 0; i < args.length; i++) {
        if (!obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
};
