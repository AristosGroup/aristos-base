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

/**
 * Устанавливает куки
 * @param name Название куки
 * @param value  Значение куки
 * @param exdays Срок действия куки в днях. Если не установлено, истекает при закрытии браузера
 * @param path Путь для записи куки (e.g., '/', '/mydir') Если не указан, равняется текущему пути URL
 */
AristosUtils.setCookie = function (name, value, exdays, path) {
    if (!exdays) exdays = null;
    if (!path) path = "/";
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = name + "=" + value + "; path=" + path;
};

/**
 * Получение куки
 * @param name Название куки
 * @returns string Значение куки
 */
AristosUtils.getCookie = function (name) {
    var i, x, y, cookiesArray = document.cookie.split(";");
    for (i = 0; i < cookiesArray.length; i++) {
        x = cookiesArray[i].substr(0, cookiesArray[i].indexOf("="));
        y = cookiesArray[i].substr(cookiesArray[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == name) {
            return decodeURIComponent(y);
        }
    }
    return false;
};

/**
 * Удаление куки
 * @param name Название куки
 * @param path Путь куки
 */
AristosUtils.deleteCookie = function (name, path) {
    if(!path) path = "/";
    if (AristosUtils.getCookie(name)) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=' + path;
    }
};