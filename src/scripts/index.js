const defaultLocation = { lat: 22.337118, lng: 114.148293 };
const globals = {
  map: null,
  apis: { places: null },
  currentLocation: defaultLocation,
  markers: [],
  restaurants: []
};

function renderRestaurantsWithReact() {
  console.log("Render restaurants", globals.restaurants);
  const domContainer = document.querySelector("#restaurant-region");
  ReactDOM.render(
    <Restaurants restaurants={globals.restaurants} />,
    domContainer
  );
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

  // Attempt to find user's real location if possible
  //updateCurrentLocation();

  // initialise services
  globals.apis.places = new google.maps.places.PlacesService(globals.map);
  findRestaurants();
};

/**
 * Attempts to find the user's current location to update the map center
 * and update globals with the new information.
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
    }, showError);
  } else alert("We do not have permission to use your current location");
};

function showError(error) {
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
const addMarker = props => {
  const { map } = globals;
  const { title, coords, icon } = props;
  const marker = new google.maps.Marker({
    position: coords,
    map,
    title
  });

  const infoWindow = new google.maps.InfoWindow({
    content: title
  });

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

const setMapCenter = props => {
  const { coords } = props;
  const { map } = globals;
  map.setCenter(coords);
};

const clearAllMarkers = () => {
  globals.markers.forEach(m => m.setMap(null));
  globals.markers = [];
};

const findRestaurants = () => {
  console.log("Finding restaurants");
  const { places } = globals.apis;
  const request = {
    location: globals.currentLocation,
    radius: "500",
    type: ["restaurant"]
  };
  places.nearbySearch(request, (result, status) => {
    console.log("Places api callback");
    console.log("status:", status);
    if (status !== "OK") {
      console.log("can't find places");
      return;
    }
    result.forEach(p => {
      const restaurant = {
        title: p.name,
        price: p.price_level,
        rating: p.rating,
        isOpen: p.opening_hours ? p.opening_hours.open_now : false
      };
      globals.restaurants.push(restaurant);
      const param = {
        title: p.name,
        coords: p.geometry.location
      };
      addMarker(param);
    });
    renderRestaurantsWithReact();
  });
};
