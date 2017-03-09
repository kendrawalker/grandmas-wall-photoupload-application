(function() {

    var templates = document.querySelectorAll('script[type="text/handlebars"]');
    Handlebars.templates = Handlebars.templates || {};
    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

//declaring Router to guide Home and Image Page
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'image/:id': 'image'
        },
        home: function() {
            var homeView = new HomeView({
                model: new ImagesModel,
                el: '#main'
            });
            new ImagesModel().on('change', function() {
                console.log(this.toJSON(homeView));
            });
        },
        image: function(id) {
            // console.log(id);
            var imageView = new ImageView({
                model: new ImageModel({id: id}),
                el: '#main'
            });
        },

    });

    var router = new Router;

////declaring Model for pulling Multiple Images and data
    var ImagesModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch();
            // console.log(this);
        },
        url: '/images'
    });

    var imagesModel = new ImagesModel;

    imagesModel.on('', function() {
        var images = this.get('home');
        this.set({
            numImages: images.length
        });
        this.trigger('change');
    });

////delcaring Model for pulling Specific Image data
    var ImageModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch().then(console.log);
            // console.log(this);
        },
        url: function(){
            return '/image/' + this.get('id');
        }
    });

    var CommentModel = Backbone.Model.extend({
        initialize: function() {
            this.save();
        },
        url: function() {
            return '/image/comment/' + this.get('image_id');
        }

    });

////declaring Home View
    var HomeView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            this.model.on('change', function() {
                view.render();
            });
        },
        render: function() {
            var html = Handlebars.templates.home(this.model.toJSON());
            // console.log(html);
            this.$el.html(html);
        },
    });

    ////declaring Image View
    var ImageView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            this.model.on('change', function() {
                view.render();
            });
        },
        render: function() {
            var html = Handlebars.templates.image(this.model.toJSON());
            // console.log(html);
            this.$el.html(html);
        },
        events: {
            'click button': 'insertComment'
        },
        insertComment: function() {
            var view = this;
            var inputComment = $('#text-input-comment').val();
            var inputCommenter = $('#text-input-commenter').val();
            new CommentModel ({
                commenter: inputCommenter,
                comment: inputComment,
                image_id: view.model.id
            }).on('change', function() {
                alert('Comment has been saved');
                // console.log(view);
                // view.updatePage();
            });
        },
            // updatePage: function()
    });

    Backbone.history.start();


})();
