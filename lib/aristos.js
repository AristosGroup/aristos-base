Aristos = function () {

    this.modules = {};
    this.mainMenu = [];

};


Aristos.prototype.addModule = function(module) {

    this.modules[module.getKey()] = module;
};

Aristos.prototype.getMainMenu = function () {

    var self = this;
    //filter по доступу
/*    this.mainMenu = _.filter(this.mainMenu, function (item) {
        return self.allowViewMainMenu(item);
    });*/

    return _.sortBy(this.mainMenu, function (item) {
        return item.sort;
    });
};



Aristos.prototype.allowViewMainMenu = function (item) {
    return this.allowViewSection(item.key);
};



Aristos.prototype.allowViewSection = function (key) {
    return Roles.userIsInRole(Meteor.userId, ['view', 'admin'], key);
};

Aristos.prototype.allowViewSecretSection = function (key) {
    return (Roles.userIsInRole(Meteor.userId, ['view-secret', 'admin'], key));
};

Aristos.prototype.allowManageSection = function (key) {
    return (Roles.userIsInRole(Meteor.userId, ['manage', 'admin'], key));
};

Meteor.Aristos = new Aristos();


