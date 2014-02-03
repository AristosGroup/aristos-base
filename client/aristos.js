Aristos = function () {

    this.sections = [];
    this.mainMenu = [];

};

Aristos.prototype.mainMenu = function () {

    return _.sortBy(this.mainMenu, function (item) {
        return item.sort;
    });
};
Aristos.prototype.addToMainMenu = function (name, section, sort, icon) {


    var key = _.slugify(name);
    var item = _.find(this.mainMenu, function (item) {
        return item.key == key;
    });

    sort = sort || this.mainMenu.length + 1;

    if (item)  throw new Meteor.Error(500, "Menu item exists");


    this.mainMenu.push({
        key: key,
        section: section,
        name: name,
        link: '/' + key,
        sort: sort,
        icon:icon
    });
};


Aristos.prototype.allowViewMainMenu = function (key) {
    var item = _.find(this.mainMenu, function (item) {
        return item.key == key;
    });
    return this.allowViewSection(item.section);
};


Aristos.prototype.sections = function () {
    return    this.sections;
};
Aristos.prototype.addSection = function (name) {


    var key = _.slugify(name);
    var item = _.find(this.sections, function (item) {
        return item.key == key;
    });

    if (item)  throw new Meteor.Error(500, "Menu item exists");

    var section = {
        key: key,
        name: name
    };

    this.sections.push(section);
    return section;
};

Aristos.prototype.allowViewSection = function (key) {
    return (Roles.userIsInRole(Meteor.userId, ['view', 'admin'], key));
};

Aristos.prototype.allowViewSecretSection = function (key) {
    return (Roles.userIsInRole(Meteor.userId, ['view-secret', 'admin'], key));
};

Aristos.prototype.allowManageSection = function (key) {
    return (Roles.userIsInRole(Meteor.userId, ['manage', 'admin'], key));
};

Meteor.Aristos = new Aristos();


