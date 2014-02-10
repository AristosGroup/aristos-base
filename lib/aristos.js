Aristos = function (modulesConfig) {
    var self = this;
    self.modules = {};
    self.modulesConfig = modulesConfig;
    self.mainMenu = [];

    if (Meteor.isServer) {
        Meteor.startup(function () {
            self.setupModules();

        });
    }

};



Aristos.prototype.setupModules = function () {

    var self = this;
    _.each(self.modulesConfig, function (moduleConfig, key) {
        var moduleClassName = _.capitalize(key) + 'Module';
        var module = null;
        if (Aristos[moduleClassName] != undefined) {
            module = Aristos[moduleClassName](key, moduleConfig);
        } else {
            console.warn('Warning: module class ' + moduleClassName + ' does not exists');
            module = new AristosModuleBase(key, moduleConfig);
        }
        module.install();
        self.modules[key] = module;
        return module;
    });


};


/**
 * Формируем список всех модулей системы
 * и пунктов для главного меню и подменю
 *
 * return {object}
 */
Aristos.prototype.setupModulesOld = function () {

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
 *  Если есть доступ, к одному из подмодулей, значит есть доступ и к этому пункту меню
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


Meteor.Aristos = function (modules) {
    return new Aristos(modules);
};


