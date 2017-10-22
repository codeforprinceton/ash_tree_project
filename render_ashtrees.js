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

function paintEntries (photo, entry) {
  console.log(photo)
  console.log(entry)
  var $photo = $("<div class='well well-sm'>" + photo.fields.datetime[lang] + " / " + photo.fields.latlong[lang].lat + ":" + photo.fields.latlong[lang].lon + "</div>")
  var $img = $("<img width='250px' src='" + photo.fields.s3url[lang] + "'>");
  $photo.append($img);
  $('#ashtree-row').append($photo)
}

//Render AshTrees
function renderPhotos (data) {
  $('#ashtree-row').empty()
  if( data.length > 0 ) {
    $.each( data, function( i, photo ){
      console.log(photo)
      var $photo = $("<div class='well well-sm'>" + photo.fields.datetime[lang] + " / " + photo.fields.latlong[lang].lat + ":" + photo.fields.latlong[lang].lon + "</div>")
      var $img = $("<img width='250px' src='" + photo.fields.s3url[lang] + "'>");
      $photo.append($img);
      $('#ashtree-row').append($photo)

    });
  }else{
    var $photo = $("<div>No ash trees yet!</div>")
    $('#ashtree-row').append($photo)
  }
}
