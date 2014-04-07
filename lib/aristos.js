Aristos = function (modulesConfig) {
    var self = this;
    self.modules = {};
    self.mainMenu = [];
    self.menuDep = new Deps.Dependency;
    console.log("AristosModules count:", AristosModules.find().count());

    //Инициализация модулей
    _.each(modulesConfig, function (moduleConfig, key) {
        var module = self.moduleInstanceByKey(key, moduleConfig);
        if(Meteor.isClient) {
            Deps.autorun(function(){
                var subHandle = Meteor.subscribe("modules", function(){
                    console.log('Rules count changed');
                    module.configureRoles();
                    module.configureMainMenu(self.mainMenu);
                });
            });
        } else {
            module.configureRoles();
        }
        module.configureRouters();
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
    //console.log('main menu before filtering: ', this.mainMenu);
    _.each(self.mainMenu, function(menuRow, menuKey) {
        var visible = false;
        _.each(menuRow.subMenu, function(subItem, subKey) {
            if (subItem.hasOwnProperty('roles') && Roles.userIsInRole(Meteor.userId(), subItem.roles)
                || subItem.hasOwnProperty('key') && Roles.userIsInRole(Meteor.userId(), ['admin'], subItem.key)) {
                visible = true;
            } else {
                delete self.mainMenu[menuKey].subMenu[subKey];
            }
        });
        if(!visible)
            delete self.mainMenu[menuKey];
    });
    //console.log('this.mainMenu.length', self.mainMenu.length);
    if(!self.mainMenu) return {};
    return _.sortBy(this.mainMenu, function (item) {
        return item.sort;
    });
};

/**
 * Массив с модулями
 * @returns {*}
 */
Aristos.prototype.getModules = function() {
    return _.toArray(App.modules);
};

/**
 * Возвращает объект сабмодуля в модуле
 * @param moduleKey
 * @param subModuleKey
 * @returns {*}
 */
Aristos.prototype.getSubModule = function(moduleKey, subModuleKey) {
    if(!App.modules.hasOwnProperty(moduleKey))
        throw new Meteor.Error(404, 'Модуль '+moduleKey+' не найден');
    var module = App.modules["accounts"];
    if(!module.subItemsIndex.hasOwnProperty(subModuleKey))
        throw new Meteor.Error(404, 'Сабмодуль ' + subModuleKey + ' в модуле ' + moduleKey + ' не найден');
    return module.subItems[module.subItemsIndex[subModuleKey]];
};

/**
 * Основной конструктор приложения, который производит инициализацию модулей
 * @param modules Объект с модулями в кач-ве ключей и конфигурацией в кач-ве значений
 * @returns {Aristos}
 * @constructor
 */
Meteor.Aristos = function (modules) {
    return new Aristos(modules);
};