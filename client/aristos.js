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


/**
 * Формируем список всех модулей системы
 * и пунктов для главного меню и подменю
 *
 * return {object}
 */
Aristos.prototype.setupModules = function () {

    var self = this;
    AristosModules.find().forEach(function (moduleConfig) {

        self.addModule(moduleConfig);

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

                    if (subItemConfig.subMenu) {
                        var subItem = {
                            name: subItemConfig.name,
                            key: subItemConfig.key,
                            sort: subItemConfig.menu.sort,
                            icon: subItemConfig.menu.icon
                        };

                        subMenu.push(subItem);
                    }


                });

                item.subMenu = subMenu;
            }


            self.addItemToMainMenu(item);
        }


    });
    return this;
};

Aristos.prototype.addItemToMainMenu = function (item) {
    this.mainMenu.push(item);
};


/**
 *
 * Массив для главного меню
 * @returns {array}
 */
Aristos.prototype.getMainMenu = function () {

    var self = this;
    //filter по доступу
    this.mainMenu = _.filter(this.mainMenu, function (item) {
        return self.allowViewMainMenu(item);
    });

    return _.sortBy(this.mainMenu, function (item) {
        return item.sort;
    });
};

/**
 *  Проверка доступа к разделу главного меню
 *  Если есть доступ, к одному из подмодулей, значит естьдоступ и к этому пункту меню
 * @param item
 * @returns {boolean}
 */
Aristos.prototype.allowViewMainMenu = function (item) {
    var subItems = this.modules[item.key].subItems;
    var result = false;
    _.each(subItems, function (subItem) {
        if (subItem.hasOwnProperty('key') && Roles.userIsInRole(Meteor.userId(), ['view'], subItem.key)) {
            return result = true;

        }
    });

    return result;
};


Meteor.Aristos = new Aristos();


