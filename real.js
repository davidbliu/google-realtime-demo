//var docId = '0BwLZUlGsG71ONks1NUhWaV9abUE' 
var docId = '';
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
var myAuth; //store auth info
var myDoc;

function authorize() {
  realtimeUtils.authorize(function(response){
    var google_root = 'https://www.googleapis.com/oauth2/v3/userinfo?';
    var access_token = response.access_token;
    var id_url = google_root + 'access_token='+access_token;
    $.ajax({
      url: id_url,
      success:function(data){
        myAuth = data;
      }
    });

    if(response.error){
      realtimeUtils.authorize(function(response){
        start();
      }, true);
    } else {
        start();
    }
  }, false);
}

function start() {
  realtimeUtils.load(docId.replace('/', ''), onFileLoaded, onFileInitialize);
}

function onFileInitialize(model) {
  console.log('initialize file');
}

function onFileLoaded(doc) {
  myDoc = doc;
  drawChat();
}

function updateCollaborators(){
  collaborators = myDoc.getCollaborators();
  console.log(collaborators);
}

function getChatItems(){
  return myDoc.getModel().getRoot().get('chat').asArray();
}

function drawChat(){
  $('#chat-container').html('');
  var chatItems = getChatItems().reverse();
  _.each(chatItems, function(item){
    chatItem = $('<div></div>');
    $(chatItem).addClass('chat-item');
    $(chatItem).append('<div>'+item.email+' : ' + item.text + '</div>');
    $('#chat-container').append(chatItem);
  });
}

function restartChat(){
  chatList = myDoc.getModel().createList();
  myDoc.getModel().getRoot().set('chat', chatList);
}

function addChat(text){
  chatItem = {
    email: myAuth.email,
    text: text
  }
  myDoc.getModel().getRoot().get('chat').push(chatItem);
}

$(document).ready(function(){
  $('#restart-chat-btn').click(function(){
    restartChat();
    drawChat();
  });
  $('#enter-chat-btn').click(function(){
    addChat($('#chat-textarea').val());
    $('#chat-textarea').val('');
    drawChat();
  });

  authorize();
});
