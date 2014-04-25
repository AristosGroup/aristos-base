aEvent = {
    //Локальная коллекция для хранения уведомлений
    collection: new Meteor.Collection(null),
    message: function(message, type) {
        switch (type) {
            case 'error':
            case 'danger':
                type = 'danger';
                break;
            case 'warning':
            case 'success':
                break;
            default: type = 'info';
        }
        if(!type) type = 'info';
        this.collection.insert({
            message: message, type: type, seen: false, time: Date.now()
        });
    },
    error: function(message) {
        this.message(message, 'error');
    },
    warning: function(message) {
        this.message(message, 'warning');
    },
    success: function(message) {
        this.message(message, 'success');
    },
    clear: function() {
        this.collection.remove({seen: true});
    }
};

Template.aEvents.helpers({
    events: function() {
        return aEvent.collection.find();
    }
});