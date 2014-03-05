/**
 * Базовый класс для модулей Aristos
 * @param key Ключ-название модуля
 * @param moduleConfig Массив с конфигурацией
 * @constructor
 */
AristosModuleBase = function (key, moduleConfig) {

    var self = this;

    self.menu = {
        sort: 2,
        icon: 'shopping-cart',

        subMenu: {

        }
    };

    self.safeConfig = ['name', 'config', 'subModules'];
    self.key = key;
    self.moduleConfig = moduleConfig;
    self.savedConfig = AristosModules.findOne({key: self.key});
    self.init(self.savedConfig);
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
    AristosUtils.debug('Инсталяция модуля: ', this);
    var self = this;
    if (!Meteor.isServer) throw new Meteor.Error('only server mode');

    var config = self._updateCollection();
    self.init(config);
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

    if (self.subModules) {
        var subMenu = [];
        _.each(self.subModules, function (subItemConfig) {
            var subItem = {
                name: subItemConfig.name,
                key: subItemConfig.key
            };
            subMenu.push(subItem);
        });

        item.subMenu = subMenu;
    }
    AristosUtils.debug('Добавление пункта меню: ', item);
    mainMenu.push(item);
};

/**
 * Обновляет конфиг модуля в БД
 * @returns Object Объект-модуль
 * @private
 */
AristosModuleBase.prototype._updateCollection = function () {

    var self = this;
    var module = self.savedConfig;

    if (!module) return self._insertToCollection();

    var newSettings = {};

    var moduleConfig = _.pick(self.moduleConfig, self.safeConfig);
    _.each(moduleConfig, function (conf, key) {
        console.log('Сравнение настроек', key, module[key], conf);
        if (module[key] != conf) {
            newSettings[key] = conf;
        }
    });

    if (_.size(newSettings) > 0) {
        console.log('Обновление настроек модуля ' + self.key + ': ', newSettings);
        AristosModules.update(module._id, {$set: newSettings});
    }

    return AristosModules.findOne(module._id);
};

/**
 * Первичное добавление записи о модуле в БД
 * Выполняется только тогда, когда в базе еще нет записи об этом модуле
 * @returns Object Объект-модуль
 * @private
 */
AristosModuleBase.prototype._insertToCollection = function () {
    var self = this;

    var newObj = _.pick(self.moduleConfig, self.safeConfig);
    newObj.key = self.key;

    var id = AristosModules.insert(newObj);

    return  AristosModules.findOne(id);
};