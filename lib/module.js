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
    self.moduleConfig = moduleConfig;
    self.init(self.moduleConfig);
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
 * Инсталяция модуля при старте приложения
 * @returns {AristosModuleBase}
 */
AristosModuleBase.prototype.install = function () {
    var self = this;
    if (!Meteor.isServer) throw new Meteor.Error('only server mode');
    /*
    var config = self._updateCollection();
    self.init(config);
    */
    return self;
};

AristosModuleBase.prototype.configureMainMenu = function (mainMenu) {
    if (!Meteor.isClient) throw new Meteor.Error('only client mode');
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
};