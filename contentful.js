var lang = 'en-US'
var accessToken = 'CFPAT-9b7a21488af237b472d49f2a7a235f8dacc4f99cee5df788bcb47bf6c5a4bb4d'
var space_id = 'vxu5be6w735m'
var query = {}
query.content_type = '1xYw5JsIecuGE68mmGMg20'
var baseAPI = 'https://api.contentful.com'
var assetAPI = baseAPI +"/spaces/" + space_id + "/assets/<asset_id>"; // ?access_token=" + accessToken;

var client = contentful.createClient({
  // This is the access token for this space. Normally you get the token in the Contentful web app
  accessToken: accessToken
})

client.getSpace(space_id)
.then((space) => space.getEntries(query))
.then((response) => renderPhotos(response.items))
.catch(console.error)

function assetEndpoint(asset_id) {
  return assetAPI.replace("<asset_id>", asset_id);
}

function renderPhotos (data) {
  $.each( data, function( i, item ){
    var img_url = "https:"
    if( item.fields.hasOwnProperty('photo') ){
      var photo = item
      $.getJSON( assetEndpoint(photo.fields.photo[lang].sys.id), { access_token: accessToken, w: '200', h: '150', fit: 'fill' } )
        .done(function( data ) {
          img_url = img_url + data.fields.file[lang].url
          var $div = $("<div>", {id: photo.fields.slug[lang], "class": "col-md-3 col-sm-6"})
          var $buttons_div = $("<div>", {"class": "likes"})
          var $p = $("<p></p>")
          var $like_button = $('<button type="button" id="' + photo.sys.id +
                              '" class="btn btn-primary btn-sm like-button" value="' + photo.fields.likes[lang] +
                              '"><span class="glyphicon glyphicon-heart"></span> <span class="likenum">' +
                              photo.fields.likes[lang] + '</span></button>')
          var $comment_button = $('<button type="button" id="' + photo.sys.id +
                              '" class="btn btn-default btn-sm comment-button" data-toggle="modal"' +
                              ' data-target="#myModal"><span class="glyphicon glyphicon-comment"></span> Comment</button>')
          var $title = $("<h2>" + photo.fields.title[lang] + "</h2>")
          var $img = $("<img>", {"class": "img-thumbnail"})
          $p.append($like_button,$comment_button)
          $buttons_div.append($p)
          $img.attr( "src", img_url )
          $div.append($title)
          $div.append($img)
          $div.append($buttons_div)
          $("#photo-row").append($div)
        })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log( "Request Failed: " + err );
      });
    }
  });
}

// increment likes
$(document).on("click", ".like-button", function(){
  // Update entry
  client.getSpace(space_id)
  .then((space) => space.getEntry(this.id))
  .then((entry) => {
    entry.fields.likes['en-US'] = entry.fields.likes['en-US'] + 1
    return entry.update()
  })
  .then((entry) => {
    $('#' + this.id + ' .likenum').text(entry.fields.likes['en-US'])
    console.log(`Entry ${entry.sys.id} updated.`)
  })
  .catch(console.error)
});

//Get Comments
$(document).on("click", ".comment-button", function(){
  $('p.comments').empty()
  client.getSpace(space_id)
  .then((space) => space.getEntries({
    content_type: 'remark',
    'fields.commentImage.sys.id': this.id
  }))
  .then((response) => renderComments(response.items))
  .catch(console.error)
});

//Render Comments
function renderComments (data) {
  if( data.length > 0 ) {
    $.each( data, function( i, comment ){
      var $comment = $("<div class='well well-sm'>" + comment.fields.commentText[lang] + "</div>")
      $('p.comments').append($comment)
    });
  }else{
    var $comment = $("<div>Be the first to comment!</div>")
    $('p.comments').append($comment)
  }
}
