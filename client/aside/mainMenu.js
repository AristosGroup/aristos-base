Template.mainMenu.helpers(
    {
        mainMenu: function () {
            //var menuCount = Session.get('menuItems');
            //AristosUtils.debug('Количество пунктов меню:', menuCount);
            var menu = App.getMainMenu();
            menu = _.map(menu, function (item) {
                if (Router.current() && _(Router.current().route.name).startsWith(item.key))
                    item.class = 'active';
                return item;
            });
            return menu;
        }
    }
);