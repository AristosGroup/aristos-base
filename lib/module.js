/**
 * Базовый класс для модулей Aristos
 * @param key Ключ-название модуля
 * @param moduleConfig Массив с конфигурацией
 * @constructor
 */
AristosModuleBase = function (key, moduleConfig) {
    var self = this;
    console.log('Creating new module instance of ' + key + ' module');
    self.menu = {
        sort: 2,
        icon: 'shopping-cart',
        subMenu: {}
    };
    self.subItems = [];
    self.subItemsIndex = {};
    self.key = key;
    self.init(moduleConfig);
};

/**
 * Инициализация модуля, применение конфигурации, индексирование сабмодулей
 * @param configs
 */
AristosModuleBase.prototype.init = function (configs) {
    var self = module = this;
    _.each(configs, function (config, key) {
        self[key] = config;
    });

    //Индексация сабмодулей
    _.each(self.subItems, function(subItem, key) {
        self.subItemsIndex[subItem.key] = key;
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
                    if(Meteor.isServer) AristosModules.insert({ key: subItemData.key, module: self.key, roles: subItemData.roles });
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
        App.menuDep.changed();
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
                callbacks.push(function(){
                    console.log('AutoRouter Callback');
                });
                if (typeof routerConfig.onBeforeAction == 'function')
                    callbacks.push(routerConfig.onBeforeAction);
                routerConfig.onBeforeAction = function () {
                    var self = this,
                        checkModule = module,
                        subModuleKey = subItemData.key;
                    console.log('Checking access for module '+checkModule.name+' with sub ' + subModuleKey);
                    if(!checkModule.checkAccess(subModuleKey)) {
                        console.log('Access denied by module');
                        this.render('accessDenied');
                        this.stop();
                        //this.redirect('/403');
                    }
                    if (callbacks.length) {
                        for (var i = 0; i < callbacks.length; i++) {
                            callbacks[i].call(self);
                        }
                    }
                }
                console.log('Добавлен роутер для модуля '+subItemData.name+' ['+subItemData.key+']', routerConfig);
                Router.route(subItemData.key, routerConfig);
            }
        });
    }
}

/**
 * Проверка доступа к модулю и редирект в случае его отсутствия
 * @param user
 * @returns {boolean}
 */
AristosModuleBase.prototype.checkAccess = function(subModuleKey, user) {
    if(!this.subItemsIndex.hasOwnProperty(subModuleKey)) throw new Meteor.Error(404,'Несуществующий сабмодуль');
    switch (typeof user) {
        case 'object':
            //ok
            break;
        case 'string':
            user = Meteor.users.findOne(user);
            break;
        default:
            user = Meteor.user();
    }
    if(!user) {
        Log('User not authenticated');
        return false;
    }
    if (!(
        Roles.userIsInRole(user, this.subItems[this.subItemsIndex[subModuleKey]].roles) //Вхождение в глобальную группу
        || Roles.userIsInRole(user, 'admin', subModuleKey) //Персональный доступ к модулю
    )) {
        Log('No access to submodule ' + subModuleKey + '');
        //Router.stop();
        //if(Meteor.isClient) location.href = '/403';
        //Router.go('/403');
        return false;
    }
    return true;
}