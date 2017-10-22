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


function assetEndpoint(asset_id) {
  return assetAPI.replace("<asset_id>", asset_id);
}

function getPreciseLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (position) {
      resolve([position.coords.latitude, position.coords.longitude]);
    });
  });
}

function createAshTreeImages(entry) {
  client.getSpace(space_id)
  .then((space) => space.createEntry('ashTreeImages', {
    fields: {
      s3url: {
        'en-US': 'https://s3.amazonaws.com/ash-tree-photos/' + img_name
      },
      imageType: {
        'en-US': 'Tree'
      },
      ashTree: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: entry.sys.id
          }
        }
      }
    }
  }))
  .then((entry) => console.log(entry))
  .catch(console.error)
}

function done(entry){
  window.location.replace('./uploadsuccess.html')
}

function createAshTree(data) {
  var d = new Date();
  var n = d.toISOString();
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
      },
      s3url: {
        'en-US': 'https://s3.amazonaws.com/ash-tree-photos/' + img_name
      }
    }
  }))
  .then((entry) => done(entry))//refresh())
  .catch(console.error)
}

var input = document.querySelector("input[type=file]");
var result_image_obj = '';
var img_name;

input.addEventListener("change", function (e) {
  img_name = input.files[0].name;
  var tempFile = input.files[0];
  alert(tempFile.name + tempFile.size + tempFile.type);
  var label = $(e.target).prev();
  label.css("border", "green solid 2px");
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
    result_image_obj = newImageData;
}

//Add Photo
$(document).on("click", "#upload", function(){
  // Update entry

  var url = "https://s3.amazonaws.com/ash-tree-photos";
  var base64ImageContent = result_image_obj.replace(/^data:image\/(png|jpeg);base64,/, "");
  var blob = base64ToBlob(base64ImageContent, 'image/jpeg');
  var blobFile = new File([blob], img_name);
  var formData = new FormData();
  formData.append('key', blobFile.name);
  formData.append('file', blobFile);

  $.ajax({
      url: url,
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: formData
    }).done(function(e){
              getPreciseLocation()
                .then(createAshTree);
          });
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
