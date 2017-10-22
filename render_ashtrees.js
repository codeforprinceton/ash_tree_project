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
  mylat.push(photo.fields.latlong[lang].lat)
  mylon.push(photo.fields.latlong[lang].lon)
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
      mylat.push(photo.fields.latlong[lang].lat)
      mylon.push(photo.fields.latlong[lang].lon)
      var $media = $("<div class='media'>");
      var $img = $("<div class='media-left'><img class='d-flex mr-3' width='250px' src='" + photo.fields.s3url[lang] + "'></div>");
      var $photo = $("<div class='media-body'>" + photo.fields.datetime[lang] + " / " + photo.fields.latlong[lang].lat + ":" + photo.fields.latlong[lang].lon + "</div>")
      $media.append($img);
      $media.append($photo);
      $('#ashtree-row').append($media)
      
      //var $photo = $("<div class='well well-sm'>" + photo.fields.datetime[lang] + " / " + photo.fields.latlong[lang].lat + ":" + photo.fields.latlong[lang].lon + "</div>")
      //var $img = $("<img width='250px' src='" + photo.fields.s3url[lang] + "'>");
      //$photo.append($img);
      //$('#ashtree-row').append($photo)
    });
    drawMap();
  }else{
    var $photo = $("<div>No ash trees yet!</div>")
    $('#ashtree-row').append($photo)
  }
}

var mymap;
var mylat = [40.3516366];
var mylon = [-74.6602049];

function initMap() {
        mymap = new google.maps.Map(document.getElementById('mymap'), {
           center: {lat: mylat[0], lng: mylon[0]},
            zoom: 14
        });
}

function drawMap() {
        mymap = new google.maps.Map(document.getElementById('mymap'), {
           center: {lat: mylat[0], lng: mylon[0]},
            zoom: 14
        });

        for (i = 0; i < mylat.length; i++) {
          mymarker = new google.maps.Marker({
              position:  {lat: mylat[i], lng: mylon[i]},
              map: mymap,
              title: 'blah!'
          });
        }
}
