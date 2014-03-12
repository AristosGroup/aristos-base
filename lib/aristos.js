Aristos = function (modulesConfig) {
    var self = this;
    self.modules = {};
    self.modulesConfig = modulesConfig;
    self.mainMenu = [];

    //Инициализация модулей
    _.each(self.modulesConfig, function (moduleConfig, key) {
        var module = self.moduleInstanceByKey(key, moduleConfig);
        if(Meteor.isServer) module.install();
        if(Meteor.isClient) module.configureMainMenu(self.mainMenu);
        if(module.subItems) {
            _.each(module.subItems, function (subItemData) {
                //Настройка прав доступа к сабмодулю
                if(Meteor.isServer) {
                    var savedRoles = AristosModules.findOne({'key': subItemData.key });
                    if(savedRoles) {
                        subItemData.roles = savedRoles.roles;
                        console.log('fetched roles for module ' + subItemData.key +
                            ': ' + subItemData.roles.join(', '));
                    } else {
                        //Вносим новую запись с правами доступа к сабмодулю
                        if(!subItemData.roles) subItemData.roles = [];
                        AristosModules.insert({ key: subItemData.key,  roles: subItemData.roles });
                        console.log('created new roles record for module ' + subItemData.key +
                            ' with roles: ' + subItemData.roles.join(', '));
                    }
                }
                //Настройка роутеров
                if(subItemData.router) {
                    console.log('Конфигурируем роутер для модуля '+subItemData.name+' ['+subItemData.key+']', subItemData.router);
                    var routerConfig = subItemData.router;
                    var callbacks = [];
                    if (typeof routerConfig.before == 'function')
                        callbacks.push(routerConfig.before);
                    if (subItemData.roles && typeof subItemData.roles == 'object' && subItemData.roles.length > 0) {
                        var rolesCheck = subItemData.roles;
                        callbacks.push(function () {
                            if (!Roles.userIsInRole(Meteor.user(), rolesCheck)) {
                                Log('Redirecting');
                                this.redirect('/');
                            }
                        });
                    }
                    if (callbacks.length) {
                        console.log('Got some callbacks');
                        routerConfig.before = function () {
                            console.log('hey bro');
                            for (var i = 0; i < callbacks.length; i++) {
                                callbacks[i].call();
                            }
                        }
                    }
                    Router.route(subItemData.key, routerConfig);
                }
            });
        }
        self.modules[key] = module;
    });
};

Aristos.prototype.moduleInstanceByKey = function(key, moduleConfig) {
    var moduleClassName = _.capitalize(key) + 'Module';
    var module = null;
    if (Aristos[moduleClassName] != undefined) {
        module = Aristos[moduleClassName](key, moduleConfig);
    } else {
        console.warn('Внимание: класс ' + moduleClassName + ' не существует. Используем базовый класс AristosModuleBase');
        module = new AristosModuleBase(key, moduleConfig);
    }
    return module;
};

/**
 *
 * Массив для главного меню
 * @returns {array}
 */
Aristos.prototype.getMainMenu = function () {
    var self = this;
    //filter по доступу
    console.log('main menu before filtering: ', this.mainMenu);
    this.mainMenu = _.filter(this.mainMenu, function (item) {
        return self.allowViewMainMenu(item);
    });
    console.log('this.mainMenu.length', this.mainMenu.length);
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

    var subItems = item.subMenu;
    var result = false;
    _.each(subItems, function (subItem) {
        if (subItem.hasOwnProperty('roles') && Roles.userIsInRole(Meteor.userId(), subItem.roles))
            return result = true;
        if (subItem.hasOwnProperty('key') && Roles.userIsInRole(Meteor.userId(), ['admin'], subItem.key))
            return result = true;
    });
    return result;
};


Meteor.Aristos = function (modules) {
    return new Aristos(modules);
};