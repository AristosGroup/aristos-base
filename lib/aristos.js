Aristos = function (modulesConfig) {
    var self = this;
    self.modules = {};
    self.mainMenu = [];
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
 * Массив с модулями
 * @returns {*}
 */
Aristos.prototype.getModules = function() {
    return _.toArray(App.modules);
}

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