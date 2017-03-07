console.log("Hello");

var submit = $('#submit-button');
console.log(submit);

submit.on('click', function() {
    console.log('button was clicked');
    var file = $('input[type="file"]').get(0).files[0];
    console.log(file);

    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false
    });
});
