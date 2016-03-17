# Sample Realtime Chat

view the [live demo](http://wd.berkeley-pbl.com/google-realtime-demo)
## setting up

* clone this repo
* `python -m SimpleHTTPServer`
* localhost:3000

## walkthrough

start with an empty html file and add the google api library into the header

```html
<head>
    <link href="https://www.gstatic.com/realtime/quickstart-styles.css" rel="stylesheet" type="text/css"/>

    <!-- Load the Realtime API JavaScript library -->
    <script src="https://apis.google.com/js/api.js"></script>
    <script src="https://www.gstatic.com/realtime/realtime-client-utils.js"></script>
</head>
```

we're going to add jquery and underscore.js just for convenience

```html
<script src = 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
```

now we should create an external stylesheet `stye.css` and an external js file `real.js`

to get things working, we need to have a google app set up. you can do this at pbl.link/google-console, but we'll just use a pre-made app. we need to include the app's id in `real.js`

we'll also have to create a doc to use. we've pre-made one for this demo, but you can research how to make on with google's realtime quickstart

```js
var clientId = <<YOUR CLIENT ID HERE>>;
var docId = <<YOUR DOC ID HERE>>;
```

now we're ready to begin

__setting up the basic methods__

create a method to authorize the user

```js
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
```

this method authorizes the user (using the google utilities library) and then calls start() if everything is successful. 

in `start()` we want to load our doc using the docId. We could also create a new doc here, which is what the quickstart does, but we'll just use an existing one

```js
function start() {
  realtimeUtils.load(docId.replace('/', ''), onFileLoaded, onFileInitialize);
}

function onFileInitialize(model) {
}

function onFileLoaded(doc) {
}
```

notice that we have to provide two callbacks for when the file is loaded and when/if the file is initialized. the onFileLoaded callback is called when the doc is loaded, the onFileInitialize is called if a new doc was just created.

we'll leave the onFileInitialize blank and edit the onFileLoaded. here we just want to save the doc in a global variable

```js
var myDoc;

...

function onFileLoaded(doc) {
	myDoc = doc;
}
```

__implementing application logic__

the previous steps are pretty much all you need to get a realtime app running. the rest is your application logic.

for this app we want to be able to create new chats. I added a button called 'Restart Chat' to create a new collaborativeList when clicked

```html
<div class = 'btn' id = 'restart-chat-btn'>Restart Chat</div>
```

and an event listener to actually create the collaborativeList

```js
function restartChat(){
  chatList = myDoc.getModel().createList();
  myDoc.getModel().getRoot().set('chat', chatList);
}

$('#restart-chat-btn').click(function(){
    restartChat();
});

```

now we should add something to let users type in chats

```html
<textarea id = 'chat-textarea'></textarea>
<div class = 'btn' id = 'enter-chat-btn'>Enter</div>
```
and the corresponding js

```js
function addChat(text){
  chatItem = {
    email: myAuth.email,
    text: text
  }
  myDoc.getModel().getRoot().get('chat').push(chatItem);
}

$('#enter-chat-btn').click(function(){
    addChat($('#chat-textarea').val());
    $('#chat-textarea').val('');
});
```

and now add something to display the chat items. our markup is just a container where the chat items will go

```html
<h1>Chat</h1>
<div id = 'chat-container'></div>
```

we should create a method to draw the chats in our collaborativeList out on the page

```js
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
```


now we should call `drawChat()` at specific places in the app. a couple places include

* when the doc is first loaded
* when a user clicks enter
* when a user restarts the chat (should draw an empty chat)

the last step is to add an event listener to the collaborativeList. when other people edit the list (add items to the chat) we want to see it in realtime. 

we'll change the onFileLoaded to add an eventListener to the collaborativeList. when values are added, we'll call `drawChat()`

```js
function onFileLoaded(doc) {
  myDoc = doc;
  myDoc.getModel().getRoot().get('chat').addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, function(){
    drawChat();
  });
  drawChat();
}
```

:)

