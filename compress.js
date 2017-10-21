var input = document.querySelector("input[type=file]");

input.addEventListener("change", function () {
  console.log(input.files[0])
  createImageBitmap(input.files[0])
    .then(response => {
      compress(response);
    });
});

function compress(source_img_obj) {
	var cvs = document.createElement("canvas");
    cvs.width = source_img_obj.width;
    cvs.height = source_img_obj.height;
    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
    var newImageData = cvs.toDataURL("image/jpeg", 0.5);
    //var result_image_obj = new Image();
    var result_image_obj = new FileReader();
    result_image_obj.src = newImageData;
    console.log(result_image_obj)
	input.files[0] = result_image_obj;
  console.log(input.files[0])
}
