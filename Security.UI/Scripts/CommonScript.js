function IsNumerics(input) {
    return (input - 0) == input && ('' + input).trim().length > 0;
}
function readURL(file, imageFrame) {
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + imageFrame)
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(file.files[0]);
    }
}
function RemoveImgURL(imageFrame) {
    $('#' + imageFrame).attr('src', '#');
}