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

now we should create a stylesheet `stye.css` and js file `real.js`

inside real.js



