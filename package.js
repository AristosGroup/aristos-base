Package.describe({
    summary: "Aristos-base"
});

Package.on_use(function(api) {
    api.use(['jquery'], 'client');

    api.add_files([
        'css/app.css',
        'css/font.css',
        'css/plugin.css'
    ], 'client');
});
