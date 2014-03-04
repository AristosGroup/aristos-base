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



    if (Meteor.isClient) {
        Meteor.startup(function () {
            self.setupMainMenu();
        });
    }

};

/**
 * Конфигурация главного меню
 */
Aristos.prototype.setupMainMenu = function() {
    var self = this;
    Deps.autorun(function(){
        var modules = AristosModules.find();
        if(modules.count() > 0) {
            modules.forEach(function (moduleConfig) {
                var module = self.moduleInstanceByKey(moduleConfig.key, moduleConfig);
                module.configureMainMenu(self.mainMenu);
            });
        }
    });
};

Aristos.prototype.setupModules = function () {
    var self = this;
    _.each(self.modulesConfig, function (moduleConfig, key) {
        var module = self.moduleInstanceByKey(key, moduleConfig);
        module.install();
        self.modules[key] = module;
        return module;
    });


};

Aristos.prototype.moduleInstanceByKey = function(key, moduleConfig) {
    var moduleClassName = _.capitalize(key) + 'Module';
    var module = null;
    if (Aristos[moduleClassName] != undefined) {
        module = Aristos[moduleClassName](key, moduleConfig);
    } else {
        console.warn('Warning: module class ' + moduleClassName + ' does not exists');
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

    var subItems = item.subMenu;
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


