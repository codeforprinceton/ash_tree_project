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

//Add Photo
$(document).on("click", "#upload", function(){
  // Update entry
  var d = new Date();
  var n = d.toISOString();
  console.log(n)
  client.getSpace(space_id)
  .then((space) => space.createEntry('ashTree', {
    fields: {
      latlong: {
        'en-US': {
          lat: 40.3514318,
          lon: -74.66029929999999
        }
      },
      datetime: {
        'en-US': n
      }
    }
  }))
  .then((entry) => refresh())
  .catch(console.error)
});
