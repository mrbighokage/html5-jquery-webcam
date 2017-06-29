<?php
//define('HTTPS_SERVER', 'https://...');

if(isset($_POST['imgBase64'])) {

    $img = $_POST['imgBase64'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);

    //saving
    $fileName = dirname(__FILE__) . '/photo.png';
    file_put_contents($fileName, $fileData);
    exit(json_encode([
        'file' => $fileName
    ]));
}
?>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">


<div id="my_web_cam"></div>

<button id="take" class="btn btn-info">CAPTURE</button>
<button id="save" class="btn btn-success">SAVE</button>
<button id="reset" class="btn btn-warning">RESET</button>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="/jquery.webcam.js"></script>

<script type="text/javascript">
    $(function () {
        $( "#my_web_cam" ).WebCam({
            beforeSave: function (xhr) {},
            afterSave: function (response) {},
            errorAfterSave: function (xhr, status, errorThrown) {},
            takePhotoCallback: function () {},
            resetPhotoCallback: function () {},
            preloader_img: '/preloader.gif',
            save_url: '/test.php',
            video_id: "video_" + $.now(),
            canvas_id: "canvas_" + $.now(),
            width: 320,
        });

        $('#take').click(function () {
            $( "#my_web_cam" ).WebCam('takePhoto');
        });

        $('#save').click(function () {
            $( "#my_web_cam" ).WebCam('savePhoto');
        });

        $('#reset').click(function () {
            $( "#my_web_cam" ).WebCam('resetPhoto');
        });
    });
</script>