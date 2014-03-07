Template.mainMenu.helpers(
    {
        mainMenu: function () {
            //var menuCount = Session.get('menuItems');
            //AristosUtils.debug('Количество пунктов меню:', menuCount);
            var menu = App.getMainMenu();
            menu = _.map(menu, function (item) {
                if (_(Router.current().route.name).startsWith(item.key))
                    item.class = 'active';
                return item;
            });
            console.log('MainMenu Helper:', menu);
            return menu;
        }
    }
);