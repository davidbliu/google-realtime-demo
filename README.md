# Sample Realtime Chat

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


