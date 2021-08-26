
var _URL = window.URL || window.webkitURL;

function fileOnSelect(input, maxwidth, maxheight, preview, previewDiv) {

    let file = input[0].files[0];

    if (file.type.includes("image")) {

        img = new Image();

        let imgwidth, imgheight;

        img.src = _URL.createObjectURL(file);

        img.onload = function () {

            imgwidth = this.width;
            imgheight = this.height;

            if (imgwidth > maxwidth || imgheight > maxheight) {

                previewDiv.show();

                previewDiv.find("#text").text(`File size limit exceeded! File resulation must be ${maxwidth}x${maxheight}. Current file resolution ${imgwidth}x${imgheight}.`);

                previewDiv.find("#text").show();

                preview.hide();

            } else {

                let reader = new FileReader();

                reader.onload = function (e) {
                    preview.attr('src', e.target.result);
                };

                if (input[0].files && input[0].files[0]) {
                    reader.readAsDataURL(input[0].files[0]);
                }

                previewDiv.show();

                previewDiv.find("#text").hide();

                preview.show();
            }
        };

    } else {

        preview.hide();

        previewDiv.show();

        previewDiv.find("#text").show();

        previewDiv.find("#text").text(`Please select an image file to preview and upload.`);

    }
}