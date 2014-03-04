Template.mainMenu.helpers(
    {
        mainMenu: function () {
            var menu = App.getMainMenu();
            console.log('MainMenu Helper:', App);
            menu = _.map(menu, function (item) {
                if (_(Router.current().route.name).startsWith(item.key))
                    item.class = 'active';
                return item;
            });
            return menu;
        }
    }
);