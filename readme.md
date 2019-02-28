# Restaurants Nearby

You can try the LIVE demo [here](https://bigriceeater.github.io/map-restaurant-ghpages/). 

This repository holds the raw project code for generating the build for Restaurants Nearby. The project is built with modern Javascript and preprocessing compilers: 

* Google Maps Api
* Babel ES6+JSX transpiler
* PugJs _(formely known as Jade)_
* ReactJs
* Bootstrap
* NodeJs

# Key Features

* Mobile Responsive UI
* Pins show location of restaurants
* Detail list of restaurants
* Sort and filter restaurants by certain criterion

# How to build locally

**NodeJs** is required to run the following commands to re-install dependencies and execute the build chain. 

```bash
npm install
npm run build
```

This will build the `.pug` files into html, compile `.jsx` and transpile ES6 javascript to browser-compatible ES5 code into the `/dist` folder. 

## API Key

It may be necessary to replace the google api key with your own due to domain-protected access to prevent abuse of the service without authorisation if the `/dist` is ran locally using `live-server`