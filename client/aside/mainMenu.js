Template.mainMenu.helpers(
    {

        mainMenu: function () {
            var menu = Meteor.Aristos.getMainMenu();

            console.log(Router.current().route.name);

            menu = _.map(menu, function (item) {
                console.log(item.key);
                if (_(Router.current().route.name).startsWith(item.key))
                    item.class = 'active';

                return item;
            });

            return menu;
        }
    }
);