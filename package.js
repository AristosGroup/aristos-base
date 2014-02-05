Package.describe({
    summary: "Aristos-base"
});

Package.on_use(function (api) {
    api.use(['underscore-string-latest', 'roles']);
    api.use(['deps', 'jquery', 'templating', 'handlebars', 'spark', 'coffeescript', 'accounts-base', 'service-configuration'], 'client');


    api.add_files([
        'lib/modules.js',
        'lib/aristos.js'

    ], ['client', 'server']);

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


    api.add_files([
        'server/fixtures.js',
        'server/publish.js'
    ], 'server');


    api.export('AristosModules', ['client', 'server']);
    api.export('Aristos', ['client', 'server']);


});
