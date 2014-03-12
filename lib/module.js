/**
 * Базовый класс для модулей Aristos
 * @param key Ключ-название модуля
 * @param moduleConfig Массив с конфигурацией
 * @constructor
 */
AristosModuleBase = function (key, moduleConfig) {

    console.log('Creating new module instance of ' + key + ' module');

    var self = this;

    self.menu = {
        sort: 2,
        icon: 'shopping-cart',
        subMenu: {
        }
    };
    self.key = key;
    self.init(moduleConfig);
};

/**
 * Инициализация модуля при каждом запросе
 * @param configs
 */
AristosModuleBase.prototype.init = function (configs) {
    var self = this;
    _.each(configs, function (config, key) {
        self[key] = config;
    });
};

/**
 * Конфигурация прав доступа к сабмодулям, чтение ранее сохраненных настроек из базы
 * @returns {AristosModuleBase}
 */
AristosModuleBase.prototype.configureRoles = function () {
    var self = this;
    if(self.subItems) {
        for(var key in self.subItems) {
            if(key && self.subItems.hasOwnProperty(key)) {
                var subItemData = self.subItems[key];
                var savedRoles = AristosModules.findOne({'key': subItemData.key });
                if(savedRoles) {
                    subItemData.roles = savedRoles.roles;
                    console.log('Fetched roles for module ' + subItemData.key +': ' + subItemData.roles.join(', '));
                } else {
                    //Вносим новую запись с правами доступа к сабмодулю
                    if(!subItemData.roles) subItemData.roles = [];
                    if(Meteor.isServer) AristosModules.insert({ key: subItemData.key,  roles: subItemData.roles });
                    console.log('Created new roles record for module ' + subItemData.key + ' with roles: ' + subItemData.roles.join(', '));
                }
                self.subItems[key].roles = subItemData.roles;
            }
        }
    }
    return self;
};

AristosModuleBase.prototype.configureMainMenu = function (mainMenu) {
    if (Meteor.isClient) {
        var self = this;
        var item = {
            name: self['name'],
            key: self['key'],
            sort: self.menu.sort,
            icon: self.menu.icon
        };

        if (self.subItems) {
            var subMenu = [];
            _.each(self.subItems, function (subItemConfig) {
                subMenu.push(subItemConfig);
            });
            item.subMenu = subMenu;
        }
        AristosUtils.debug('Добавление пункта меню: ', item);
        mainMenu.push(item);
    }
};

AristosModuleBase.prototype.configureRouters = function() {
    var module = this;
    if(module.subItems) {
        _.each(module.subItems, function (subItemData) {
            //Настройка роутеров
            if(subItemData.router) {
                //console.log('Конфигурируем роутер для модуля '+subItemData.name+' ['+subItemData.key+']', subItemData.router);
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
                    routerConfig.before = function () {
                        for (var i = 0; i < callbacks.length; i++) {
                            callbacks[i].call();
                        }
                    }
                }
                Router.route(subItemData.key, routerConfig);
            }
        });
    }
}