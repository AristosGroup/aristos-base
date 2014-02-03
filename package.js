Package.describe({
    summary: "Aristos-base"
});

Package.on_use(function(api) {
    api.use('roles');
    api.use(['jquery'], 'client');

    api.add_files([
        'client/aristos.js'
    ], 'client');

    api.add_files([
        'css/app.css',
        'css/font.css',
        'css/plugin.css'
    ], 'client');


    api.add_files([
        'server/fixtures.js',
        'server/publish.js'
    ], 'server');

});
