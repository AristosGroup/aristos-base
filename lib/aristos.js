Aristos = function () {

    this.modules = {};
    this.mainMenu = [];

    var self = this;


    if (Meteor.isClient) {
        Meteor.startup(function () {
            self.setupModules();

        });
    }


};


Aristos.prototype.addModule = function (moduleConfig) {

    this.modules[moduleConfig.key] = moduleConfig;
};


Aristos.prototype.setupModules = function () {

    var self = this;
    AristosModules.find().forEach(function (moduleConfig) {

        self.addModule(moduleConfig);
        console.log(moduleConfig);

        //configure main menu
        if (moduleConfig.mainMenu) {


            var item = {
                name: moduleConfig.name,
                key: moduleConfig.key,
                sort: moduleConfig.menu.sort,
                icon: moduleConfig.menu.icon
            };


            if (moduleConfig.subItems) {
                var subMenu = [];
                _.each(moduleConfig.subItems, function (subItemConfig) {
                    var subItem = {
                        name: subItemConfig.name,
                        key: subItemConfig.key,
                        sort: subItemConfig.menu.sort,
                        icon: subItemConfig.menu.icon
                    };


                    subMenu.push(subItem);


                });

                item.subMenu = subMenu;
            }


            self.addItemToMainMenu(item);
        }


    });

    console.log(this.modules);
};

Aristos.prototype.addItemToMainMenu = function (item) {
    this.mainMenu.push(item);
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


