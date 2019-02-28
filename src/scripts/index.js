const defaultLocation = { lat: 22.337118, lng: 114.148293 };
const globals = {
  map: null,
  apis: { places: null },
  currentLocation: defaultLocation,
  markers: [],
  restaurants: []
};

function renderRestaurantsWithReact(shops) {
  const domContainer = document.querySelector("#restaurant-region");
  ReactDOM.render(<Restaurants restaurants={shops} />, domContainer);
}

/**
 * The entry point for Google Maps to initialise to a prefixed location before
 * attempting to get the user's real location which can be a slow operation.
 */
const initMap = () => {
  // Get started with the defaults
  console.log("Init google maps");
  globals.map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 15
  });
  addMarker({ title: "Your Location", coords: defaultLocation });

  // Experimental: requires SSL connection
  //updateCurrentLocation();

  // initialise services
  globals.apis.places = new google.maps.places.PlacesService(globals.map);
  findRestaurants();
};

/**
 * Attempts to find the user's current location to update the map center
 * and update globals with the new information. Only works from https SSL
 * connections.
 */
const updateCurrentLocation = () => {
  console.log("Update location");
  // Depends on HTML5
  if (navigator.geolocation) {
    // the callback is async
    console.log("trying to find you");
    navigator.geolocation.getCurrentPosition(p => {
      console.log("found location");
      const { latitude, longitude } = p.coords;
      const coords = {
        lat: latitude,
        lng: longitude
      };

      globals.currentLocation = coords;
      setMapCenter({ coords });
      clearAllMarkers();
      addMarker({ coords });
    }, showGeolocationError);
  } else alert("We do not have permission to use your current location");
};

function showGeolocationError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

/**
 * Given the location, add the marker to the map and store in globals array.
 *
 * @param {String} title - name of the marker
 * @param {Object} coords - the latitutide and longitude of the location
 */
const addMarker = ({ title, coords }) => {
  const { map } = globals;
  const marker = new google.maps.Marker({
    position: coords,
    map,
    title
  });

  const infoWindow = new google.maps.InfoWindow({
    content: title
  });

  // mobile devices don't have "hover" so we need the click event too
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  marker.addListener("mouseover", () => {
    infoWindow.open(map, marker);
  });

  marker.addListener("mouseout", () => {
    infoWindow.close();
  });

  globals.markers.shift(marker);
};

/**
 * Re-adjust the view of the map at the center of the given coordinates.
 *
 * @param {Object} coords - the latitutide and longitude of the location
 */
const setMapCenter = props => {
  const { coords } = props;
  const { map } = globals;
  map.setCenter(coords);
};

/**
 * Remove all markers from the map and throw the markers away.
 *
 */
const clearAllMarkers = () => {
  globals.markers.forEach(m => m.setMap(null));
  globals.markers = [];
};

/**
 * Use the Places API to find nearby restaurants at the current location,
 * within a 500m radius, then render the results to page with react.
 */
const findRestaurants = () => {
  console.log("Finding restaurants");
  const { places } = globals.apis;
  const request = {
    location: globals.currentLocation,
    radius: "500",
    type: ["restaurant"]
  };
  places.nearbySearch(request, (result, status) => {
    if (status !== "OK") {
      console.log("can't find places");
      return;
    }
    result.forEach(p => {
      addRestaurant(p);
      const param = {
        title: p.name,
        coords: p.geometry.location
      };
      addMarker(param);
    });
    showAllRestaurants();
  });
};

/**
 * Creates the restaurant objects and stores the complete source of truth
 * into globals.
 *
 * @param {Object} data - A single PlacesResultInterface object from Places Api
 */
const addRestaurant = data => {
  const restaurant = {
    title: data.name,
    address: data.vicinity || "",
    price: data.price_level,
    rating: data.rating,
    photo: data.photos
      ? data.photos[0].getUrl()
      : "https://hlfppt.org/wp-content/uploads/2017/04/placeholder.png",
    isOpen: data.opening_hours ? data.opening_hours.open_now : false
  };
  globals.restaurants.push(restaurant);
};

// Only triggered when 'onchange' has a different value
// We don't need to prevent same filter happening twice
const sortByChanged = () => {
  const filterAll = 0;
  const filterAffordable = 1;
  const filterBestRated = 2;
  const filterOpenNow = 3;

  const filter = document.getElementById("sortByControl");
  const value = filter.options[filter.selectedIndex].value;

  switch (Number(value)) {
    case filterAll:
      showAllRestaurants();
      break;
    case filterAffordable:
      console.log("affordable");
      showAffordableRestaurants();
      break;
    case filterBestRated:
      showBestRestaurants();
      break;
    case filterOpenNow:
      showOpenNowRestaurants();
      break;
    default:
    // do nothing
  }
};

const showAllRestaurants = () => {
  renderRestaurantsWithReact(globals.restaurants);
};

const showAffordableRestaurants = () => {
  // only show shops with actual price, otherwise 'affordable' is meaningless.
  const hasPrice = globals.restaurants.filter(r => r.price);
  const cheapest = hasPrice.sort((first, second) => first.price - second.price);
  renderRestaurantsWithReact(cheapest);
};

const showBestRestaurants = () => {
  // shops with no ratings are 'undefined' similar to 0 so no need to filter ?
  const hasRating = globals.restaurants.filter(r => r.rating);
  const best = hasRating.sort((first, second) => second.rating - first.rating);
  renderRestaurantsWithReact(best);
};

const showOpenNowRestaurants = () => {
  const openShops = globals.restaurants.sort(
    (first, second) => second.isOpen - first.isOpen
  );
  renderRestaurantsWithReact(openShops);
};
