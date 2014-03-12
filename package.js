Package.describe({
    summary: "Aristos-base"
});

Package.on_use(function (api) {

    api.add_files([
        'lib/module.js',
        'lib/aristos.js',
        'lib/router.js',
        'lib/modules_model.js',
        'lib/users.js'

    ], ['client', 'server']);

    api.use(['underscore-string-latest', 'roles', 'iron-router', 'accounts-base']);
    api.use(['deps', 'jquery', 'templating', 'handlebars', 'spark', 'coffeescript', 'service-configuration'], 'client');

    api.add_files([

        'client/subscribe.js',

        'client/notifications/notifications.html',
        'client/notifications/notifications.js',

        'client/errors.html',
        'client/notFound.html',
        'client/errors.js',

        'client/loading.html',

        'client/access_denied.html',
        'client/login.js',

        'client/aside/mainMenu.html',
        'client/aside/mainMenu.js',

        'client/aside/aside.html',
        'client/aside/aside.js',

        'client/layout.html',

        'css/app.css',
        'css/font.css',
        'css/plugin.css'
    ], 'client');


    api.add_files('server/users.js', 'server');

    api.add_files([
        'server/fixtures.js',
        'server/publish.js'
    ], 'server');
    api.export('AristosModules', ['client', 'server']);
    api.export('AristosModuleBase', ['client', 'server']);
    api.export('Aristos', ['client', 'server']);
    api.export('UserManager', ['client', 'server']);

    //Utils
    api.add_files(['lib/AristosUtils.js'], ['client', 'server']);
    api.export('AristosUtils', ['client', 'server']);
});
