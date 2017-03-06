(function() {
    var inputValue;
    var inp = $('#text-input').eq(0);

    inp.on('input', function() {
        inputValue = inp.val();
        try {
            localStorage.setItem('text', inputValue);
            console.log(localStorage.getItem('text'));
        } catch (e) {
            console.log(e);
        }
    });
})();
