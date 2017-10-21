var input = document.querySelector("input[type=file]");

input.addEventListener("change", function () {
  var file = input.files[0];
  drawOnCanvas(file);
};

function compress(source_img_obj) {	
	var cvs = document.createElement("canvas");
    cvs.width = source_img_obj.naturalWidth;
    cvs.height = source_img_obj.naturalHeight;
    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
    var newImageData = cvs.toDataURL("image/jpeg", 0.5);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
	input.files[0] = result_image_obj;
}
