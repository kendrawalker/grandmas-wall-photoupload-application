(function() {

    var templates = document.querySelectorAll('script[type="text/handlebars"]');
    Handlebars.templates = Handlebars.templates || {};
    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    var Router = Backbone.Router.extend({
        routes: {
            'home': 'users'
        },
        home: function() {
            console.log();
        },
    });

    var router = new Router;

    var UsersViewHome = Backbone.View.extend({
        initialize: function() {
            var view = this;
            this.model.on('change', function() {
                view.render();
            });
        },
        render: function() {
            var html = Handlebars.templates.home(this.model.toJSON());
            this.$el.html(html);
        },
        events: {
            'click .first-name-heading': function() {
                this.model.sortUsersBy('firstName');
            },
            'click .last-name-heading': function() {
                this.model.sortUsersBy('lastName');
            }
        }
    });

    Backbone.history.start();


})();
