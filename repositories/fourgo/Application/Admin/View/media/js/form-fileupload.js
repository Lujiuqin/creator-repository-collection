var FormFileUpload = function () {


    return {
        //main function to initiate the module
        init: function () {

            // Initialize the jQuery File Upload widget:
            $('#fileupload').fileupload({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                url: '../'
            });

            // Load existing files:
            // Demo settings:
            $.ajax({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                url: $('#fileupload').fileupload('option', 'url'),
                dataType: 'json',
                context: $('#fileupload')[0],
                maxFileSize: 100000000,
                acceptFileTypes: /(\.|\/)(gif|jpeg|jpg|png|bmp)$/i,
                process: [{
                        action: 'load',
                        fileTypes: /^image\/(gif|jpeg|jpg|png|bmp)$/,
                        maxFileSize: 100000000 // 20MB
                    }, {
                        action: 'resize',
                        maxWidth: 2440,
                        maxHeight: 1900
                    }, {
                        action: 'save'
                    }
                ]
            }).done(function (result) {
                $(this).fileupload('option', 'done')
                    .call(this, null, {
                    result: result
                });
            });

            // Upload server status check for browsers with CORS support:
            if ($.support.cors) {
                $.ajax({
                    url: '../',
                    type: 'HEAD'
                }).fail(function () {
                    $('<span class="alert alert-error"/>')
                        .text('Upload server currently unavailable - ' +
                        new Date())
                        .appendTo('#fileupload');
                });
            }

            // initialize uniform checkboxes  
            App.initUniform('.fileupload-toggle-checkbox');
        }

    };

}();