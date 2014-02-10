AristosUtils = {};


AristosUtils.typeOf = function (obj) {
    if (obj && obj.typeName)
        return obj.typeName;
    else
        return Object.prototype.toString.call(obj);
};

AristosUtils.inherits = function (child, parent) {
    if (AristosUtils.typeOf(child) !== '[object Function]')
        throw new Error('First parameter to Utils.inherits must be a function');

    if (AristosUtils.typeOf(parent) !== '[object Function]')
        throw new Error('Second parameter to Utils.inherits must be a function');

    for (var key in parent) {
        if (parent.hasOwnProperty(key))
            child[key] = parent[key];
    }

    function ctor () {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};