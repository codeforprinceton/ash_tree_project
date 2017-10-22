var lang = 'en-US'
var accessToken = 'CFPAT-9b7a21488af237b472d49f2a7a235f8dacc4f99cee5df788bcb47bf6c5a4bb4d'
var space_id = 'vxu5be6w735m'
var query = {}
query.content_type = 'ashTree'
var baseAPI = 'https://api.contentful.com'
var assetAPI = baseAPI +"/spaces/" + space_id + "/assets/<asset_id>"; // ?access_token=" + accessToken;

var client = contentful.createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: accessToken
})

refresh();

function refresh() {
  client.getSpace(space_id)
  .then((space) => space.getEntries(query))
  .then((response) => renderPhotos(response.items))
  .catch(console.error)
}

function assetEndpoint(asset_id) {
  return assetAPI.replace("<asset_id>", asset_id);
}

//Render Comments
function renderPhotos (data) {
  console.log(data)
  $('#ashtree-row').empty()
  if( data.length > 0 ) {
    $.each( data, function( i, photo ){
      var $photo = $("<div class='well well-sm'>" + photo.fields.datetime[lang] + " / " + photo.fields.latlong[lang].lat + ":" + photo.fields.latlong[lang].lon + "</div>")
      $('#ashtree-row').append($photo)
    });
  }else{
    var $photo = $("<div>No ash trees yet!</div>")
    $('#ashtree-row').append($photo)
  }
}

function getPreciseLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (position) {
      resolve([position.coords.latitude, position.coords.longitude]);
    });
  });
}

function printLatLon(data) {
  var d = new Date();
  var n = d.toISOString();
  console.log(n)
  client.getSpace(space_id)
  .then((space) => space.createEntry('ashTree', {
    fields: {
      latlong: {
        'en-US': {
          lat: data[0],
          lon: data[1]
        }
      },
      datetime: {
        'en-US': n
      }
    }
  }))
  .then((entry) => refresh())
  .catch(console.error)
}

var input = document.querySelector("input[type=file]");
var result_image_obj = '';
var orig_img;

input.addEventListener("change", function () {

  // createImageBitmap(input.files[0])
  //   .then(response => {
  //     compress(response);
  //   });
});

function compress(source_img_obj) {
	var cvs = document.createElement("canvas");
    cvs.width = source_img_obj.width;
    cvs.height = source_img_obj.height;
    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
    var newImageData = cvs.toDataURL("image/jpeg", 0.5);
    //var result_image_obj = new Image();
    // var result_image_obj = new FileReader();
    result_image_obj = newImageData;
    // console.log(result_image_obj)
	  // input.files[0] = result_image_obj;
    // console.log(input.files[0])
}

$( "#uploadImage" ).submit(function( event ) {
  orig_img = input.files[0];
  // var formData = new FormData(orig_img);
  // formData.append('picture', orig_img);
  var form_data = new FormData();
    form_data.append('key', orig_img.name);
    form_data.append('file', orig_img);

    for (var key of form_data.entries()) {
        console.log(key[1]);
    }

  var url = "https://s3.amazonaws.com/ash-tree-photos";

  $.ajax({
      url: url,
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: form_data
    }).done(function(e){
              alert('done!');
          });
  event.preventDefault();
});

//Add Photo
$(document).on("click", "#upload", function(){
  // Update entry

  var url = "https://s3.amazonaws.com/ash-tree-photos";
  var base64ImageContent = result_image_obj.replace(/^data:image\/(png|jpeg);base64,/, "");
  var blob = base64ToBlob(base64ImageContent, 'image/jpeg');
  var blobFile = new File([blob], "abc.jpg");
  var formData = new FormData();
  formData.append('picture', blobFile);

  $.ajax({
      url: url,
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: input.files[0]
    }).done(function(e){
              alert('done!');
              getPreciseLocation()
                .then(printLatLon);
          });
});

// check box on file select
$('input').on("change", function(event){
  console.log(event.currentTarget.value)
});

function base64ToBlob(base64, mime)
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}
