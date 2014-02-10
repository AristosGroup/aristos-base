AristosModuleBase = function (key, moduleConfig) {

    var self = this;

    self.safeConfig = ['name', 'config', 'subModules'];
    self.key = key;
    self.moduleConfig = moduleConfig;
    self.savedConfig = AristosModules.findOne({key: self.key});
    self.init(self.savedConfig);
};

AristosModuleBase.prototype.init = function(configs) {
    var self = this;

    _.each(configs, function(config, key) {
        self[key] = config;
    });
};

AristosModuleBase.prototype.install = function () {

    var self = this;
    if (!Meteor.isServer) throw new Meteor.Error('only server mode');

    var config = self._updateCollection();
    self.init(config);
    return self;
};


AristosModuleBase.prototype._updateCollection = function () {

    var self = this;
    var module = self.savedConfig;

    if (!module) return self._insertToCollection();

    var newSettings = {};

    var moduleConfig = _.pick(self.moduleConfig, self.safeConfig);
    _.each(moduleConfig, function (conf, key) {

        if (module[key] != conf) {
            newSettings[key] = conf;
        }
    });

    if (_.size(newSettings) > 0) {
        AristosModules.update(module._id, {$set: newSettings});
    }

    return AristosModules.findOne(module._id);
};

/**
 * Выполняется только тогда, когда в базе еще нет записи об этом модуле
 */
AristosModuleBase.prototype._insertToCollection = function () {
    var self = this;

    var newObj  = _.pick(self.moduleConfig, self.safeConfig);
    newObj.key = self.key;

    var id = AristosModules.insert(newObj);

    return  AristosModules.findOne(id);
};