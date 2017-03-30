(function() {

    var templates = document.querySelectorAll('script[type="text/handlebars"]');
    Handlebars.templates = Handlebars.templates || {};
    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

//declaring Router to guide Home, Image, and Upload Page
    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'image/:id': 'image',
            'upload': 'upload'
        },
        home: function() {
            $('#main').off();
            var homeView = new HomeView({
                model: new ImagesModel,
                el: '#main'
            });
        },
        image: function(id) {
            $('#main').off();
            var imageView = new ImageView({
                model: new ImageModel({id: id}),
                el: '#main'
            });
        },
        upload: function() {
            console.log('upload button was clicked');
            $('#main').off();
            var uploadView = new UploadView({
                model: new UploadModel,
                el: '#main'
            });
        }
    });

    var router = new Router;

////declaring Model for pulling Multiple Images and data
    var ImagesModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch();
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
        },
        url: function(){
            return '/image/' + this.get('id');
        }
    });

////declaring Model for pulling Comment data
    var CommentModel = Backbone.Model.extend({
        initialize: function() {
            // console.log(22);
            this.save().then(function() {
                console.log('save completed');
            });
        },
        url: function() {
            console.log(this);
            return '/image/comment/' + this.get('image_id');
        }
    });

////declaring Model for Uploaded data
    var UploadModel = Backbone.Model.extend({
        save: function() {
            var formData = new FormData();
            formData.append('file', this.get('file'));
            formData.append('title', this.get('title'));
            formData.append('username', this.get('username'));
            formData.append('description', this.get('description'));
            return $.ajax({
                url: '/new/image',
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false
            }).then((data) => {
                this.set(data);
            }).catch(function(err) {
                console.log(err, 'ajax request');
            });
        }
    })

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
            console.log('insert comment initiated');
            var view = this;
            var inputComment = $('#text-input-comment').val();
            var inputCommenter = $('#text-input-commenter').val();
            new CommentModel ({
                commenter: inputCommenter,
                comment: inputComment,
                image_id: view.model.id
            }).on('change', function() {
                alert('Comment has been saved');
                console.log(this.get('comments'));
                view.model.set({
                    comments: this.get('comments')
                });
            });
        },
    });

////declaring Upload View
    var UploadView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            view.render();
        },
        render: function() {
            var html = Handlebars.templates.upload(this.model.toJSON());
            console.log(html);
            this.$el.html(html);
        },
        events: {
            'click button': 'InsertUpload'
        },
        InsertUpload: function() {
            var view = this;
            var inputDesc = $('#text-input-description').val();
            var inputUploader = $('#text-input-uploader').val();
            var inputTitle = $('#text-input-title').val();
            var file = $('input[type="file"]').get(0).files[0];
            console.log(inputDesc, inputUploader, inputTitle, file);
            console.log(file.name);
            if(file && inputTitle && inputUploader && inputDesc) {
                this.model.set({
                    file: file,
                    username: inputUploader,
                    title: inputTitle,
                    description: inputDesc
                }).save().then(function(){
                    view.render()
                });
            }
        }
    });


    Backbone.history.start();
})();
