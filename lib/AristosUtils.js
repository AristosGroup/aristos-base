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
 * Вывод отладочных сообщений при наличии куки debug
 * @param message Один или несколько объектов для отображения
 */
AristosUtils.debug = function(message) {
    if(Meteor.isServer || parseInt(this.getCookie('debug')) > 0) {
        Function.prototype.apply.apply(console.log, [console, arguments]);
        //console.log(arguments);
    }
}

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
    if (this.getCookie(name)) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=' + path;
    }
};

/**
 * Обрезка пробелов по краям строки
 * @returns {string}
 */
AristosUtils.trim = function(){ return this.replace(/^\s+|\s+$/g, ''); };

/**
 * Стрингификация RegExp объекта при переводе в JSON
 * @type {Function|Object.toString|*}
 */
RegExp.prototype.toJSON = RegExp.prototype.toString;

/**
 * Возвращение объекта с коллекцией по имени
 * @param name {String} название коллекции
 * @returns {Meteor.Collection}
 */
AristosUtils.getCollection = function(name) {
    var collection = name.replace(new RegExp('[^A-Za-z0-9\-\_ ]', 'g'), '');
    var globals = Function('return this')(); //Хак для получения глобальных переменных
    if(Meteor.isClient) globals = window;
    if(globals.hasOwnProperty(collection) && globals[collection] instanceof Meteor.Collection) {
        collection = globals[collection];
    }
    if(typeof collection != 'object') throw new Error('Не удалось распознать коллекцию ' + name);
    return collection;
};

/**
 * Класс для расширенной сериализации JSON объектов с поддержкой функций и регулярных выражений
 * @type {{stringify: stringify, parse: parse}}
 */
AristosUtils.JSON = {

    /**
     * Сериализация объекта в строку
     * @param obj
     * @returns {*}
     */
    stringify: function(obj){
        var self = this,
            serialized = {};

        _.each(obj, function(elem, key) {
            var type = Object.prototype.toString.call(elem).split(/\W/)[2];
            if(_.contains(['RegExp', 'String', 'Number'], type)) {
                serialized[key] = {
                    type: type,
                    value: elem.toString()
                }
            } else {
                serialized[key] = {
                    type: 'Object',
                    value: self.stringify(elem)
                }
            }
        });
        return JSON.stringify(serialized);
    },

    /**
     * Преобразование сериализованной строки в объект
     * @param json
     * @returns {{}}
     */
    parse: function(json){
        var self = this,
            objectified = {},
            obj = JSON.parse(json);
        _.each(obj, function(elem, key) {
            if(elem.hasOwnProperty('type')) {
                switch (elem.type) {
                    case 'Object': objectified[key] = self.parse(elem.value); break;
                    case 'RegExp': objectified[key] = RegExp.apply(undefined, /\/(.*)\/([a-z]+)?/.exec(elem.value).slice(1)); break;
                    case 'Function': objectified[key] = new Function("return ("+elem.value+")")(); break;
                    default: objectified[key] = elem.value;
                }
            } else {
                $.warn(key, ' не имеет типа');
            }
        });
        return objectified;
    }
}

/**
 * Получение значения элемента объекта по строковому ключу
 * @param position
 * @param object
 * @param defaultValue
 * @returns {*}
 */
AristosUtils.getValueForPosition = function(position, object, defaultValue) {
    position = position.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    position = position.replace(/^\./, '');           // strip a leading dot
    var a = position.split('.');
    while (a.length) {
        var n = a.shift();
        if(object.hasOwnProperty(n)) {
            object = object[n];
        } else {
            if(typeof defaultValue != 'undefined') return defaultValue;
            return;
        }
    }
    return object;
};

AristosUtils.fadeAndClear = function($ob, delay) {
    if(!delay) delay = 1500;
    setTimeout(function(){
        $ob.fadeOut(function(){
            $ob.text('').fadeIn();
        });
    }, delay);
};

AristosUtils.callMethod = function(methodName, $status, data, options) {
    var options = _.defaults({

    }, options);
};