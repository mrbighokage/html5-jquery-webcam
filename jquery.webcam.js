/**
 *
 */
; (function( $ ){

    var methods = {
        init: function( options ) {

            // These are the defaults.
            $.fn.WebCam.settings = $.extend({
                beforeSave: function (xhr) {},

                afterSave: function (response) {},

                errorAfterSave: function (xhr, status, errorThrown) {
                    //Here the status code can be retrieved like;
                    debug(xhr.status);

                    //The message added to Response object in Controller can be retrieved as following.
                    debug(xhr.responseText);
                },

                takePhotoCallback: function () {},

                resetPhotoCallback: function () {},

                preloader_img: '/preloader.gif',

                save_url: '/test.php',

                video_id: "video_" + $.now(),

                canvas_id: "canvas_" + $.now(),

                width: 320,
            }, options );

            $.fn.WebCam.settings.streaming = false;
            $.fn.WebCam.settings.height = 0;
            $.fn.WebCam.settings.this = $(this);

            $(this).html('');

            $(this).css('position', 'relative');
            $(this).css('width', $.fn.WebCam.settings.width + 'px');
            $(this).css('display', 'inline-block');

            $(this).append('<video id="' + $.fn.WebCam.settings.video_id + '"></video>');
            $(this).append('<canvas id="' + $.fn.WebCam.settings.canvas_id + '"/>');

            showVideo();
            initWebCam();
        },
        takePhoto: function() {
            var video = document.querySelector('#' + $.fn.WebCam.settings.video_id);
            var canvas = document.querySelector('#' + $.fn.WebCam.settings.canvas_id);

            canvas.width = $.fn.WebCam.settings.width;
            canvas.height = $.fn.WebCam.settings.height;
            canvas.getContext('2d').drawImage(
                video,
                0,
                0,
                $.fn.WebCam.settings.width,
                $.fn.WebCam.settings.height
            );

            showCanvas();
            $.fn.WebCam.settings.takePhotoCallback();
        },
        resetPhoto: function() {
            showVideo();
            $.fn.WebCam.settings.resetPhotoCallback();
        },
        savePhoto: function() {
            var canvas = document.querySelector('#' + $.fn.WebCam.settings.canvas_id);

            $.ajax({
                type: "POST",
                url: $.fn.WebCam.settings.save_url,
                dataType: "json",
                data: {
                    imgBase64: canvas.toDataURL()
                },
                beforeSend: function(xhr) {
                    $($.fn.WebCam.settings.this).prepend('<img src="' + $.fn.WebCam.settings.preloader_img + '" style="width: 50px;height: 50px;position: absolute;left: calc(50% - 25px);top: calc(50% - 25px);">');
                    $.fn.WebCam.settings.beforeSave(xhr);
                },
                success: function (response) {
                    $($.fn.WebCam.settings.this).find('img').remove();
                    $.fn.WebCam.settings.afterSave(response);
                },
                error: function (xhr, status, errorThrown) {
                    $.fn.WebCam.settings.errorAfterSave(xhr, status, errorThrown);
                }
            });
        }
    };

    $.fn.WebCam = function( method ) {

        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method "' +  method + '" not found in jQuery.WebCam' );
        }

        return this;
    };

    function debug($message) {
        if (window.console && window.console.log) {
            window.console.log('JQuery WebCam: ' + $message);
        }
    };

    function showCanvas() {
        $('#' + $.fn.WebCam.settings.canvas_id).css('display', 'block');
        $('#' + $.fn.WebCam.settings.video_id).css('display', 'none');
    };

    function showVideo() {
        $('#' + $.fn.WebCam.settings.canvas_id).css('display', 'none');
        $('#' + $.fn.WebCam.settings.video_id).css('display', 'block');
    };

    function initWebCam() {
        var video = document.querySelector('#' + $.fn.WebCam.settings.video_id);
        var canvas = document.querySelector('#' + $.fn.WebCam.settings.canvas_id);
        navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        navigator.getMedia({
                video: true,
                audio: false
            },
            function(stream) {
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();
            },
            function(err) {
                debug(err);
            }
        );

        video.addEventListener('canplay', function(ev) {
            if (!$.fn.WebCam.settings.streaming) {
                $.fn.WebCam.settings.height = video.videoHeight / (video.videoWidth / $.fn.WebCam.settings.width);

                video.setAttribute('width', $.fn.WebCam.settings.width);
                video.setAttribute('height', $.fn.WebCam.settings.height);

                canvas.setAttribute('width', $.fn.WebCam.settings.width);
                canvas.setAttribute('height', $.fn.WebCam.settings.height);

                $.fn.WebCam.settings.streaming = true;

                $($.fn.WebCam.settings.this).css('width', $.fn.WebCam.settings.width + 'px');
                $($.fn.WebCam.settings.this).css('height', $.fn.WebCam.settings.height + 'px');
            }
        }, false);
    };
}( jQuery ));