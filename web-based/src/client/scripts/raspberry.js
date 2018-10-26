(function () {
    $("#toggler").change(function () {
        let options = {
            type: 'PUT',
            url: '/api/control',
            data: {

            },
            contentType: "application/json",
            success: function (data, status) {
                alert(data.value);
            },
            dataType: 'json'
        }
        if (this.checked) {
            let data = {
                control: {
                    led1: true
                }
            };
            options.data = JSON.stringify(data);
            $.ajax(options);

        } else {
            let data = {
                control: {
                    led1: false
                }
            };
            options.data = JSON.stringify(data);
            $.ajax(options);
        }
    });

    function readLEDState() {
        let options = {
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            url: '/api/state',
            success: function (data, status) {
                if (data) {
                    if (data.value === "ON") {
                        $('#toggler').attr('checked', 'checked');
                    } else {
                        $('#toggler').removeAttr('checked');
                    }
                }
            }
        };
        $.ajax(options);
    }
    readLEDState();

})();