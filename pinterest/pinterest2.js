//  Initialize once with app id
PDK.init({ appId: '4976224077197881480', cookie: true });

//  Pinterest SDK actions
var Pinterest = {
    /*
     *  Use the SDK to log into the user's Pinterest
     *  param [Function] callback - function started when complete
     */
    login: function(callback) {
        PDK.login({ scope : 'read_public, write_public, read_relationships, write_relationships' }, callback);
    },
    //  Use the SDK to log out of  the user's Pinterest
    logout: function() {
        PDK.logout();
    },
    //  Use SDK to determine auth state of user
    loggedIn: function() {
        return !!PDK.getSession();
    },
    /*
     *  Use SDK to delete a duplicate Pin
     *  param [Object]   data     - {board, note, link, image_url}
     *  param [Function] callback - function started when complete
     */
    deletePin: function(data, callback) {
        PDK.request('/pins/', 'DELETE', data, callback);
    },
    /*
     *  Use SDK to request user's boards
     *  param {Function} callback - function started when complete
     */
    myBoards: function(callback) {
        PDK.me('boards', { fields: 'id,name,image[small]' }, callback);
    }
};

module.exports = Pinterest;

// INSIDE OF MAIN.html
// SDK let us know if there's more information & takes it
var pins = [];
PDK.request('/boards/Techies/pins/', function (response) { // TEMP BOARD : Techies
  if (!response || response.error) {
    alert('Error occurred');
  } else {
    pins = pins.concat(response.data);
    if (response.hasNext) {
      response.next(); // this will recursively go to this same callback
    }
  }
});

// From Pinterest.js
// Pinterest log in
function login() {
  PDK.login({ scope : 'write_public, read_public' }, function(response) {
    console.log(response); //TEST to see response status
    // Display the status of their login
    if (response.status === 'connected') {
      document.getElementById('show').innerHTML = 'You are connected! We will now be deleting duplicate pins.';
      // Look through the boards
      myBoards(response);
      // Look for duplicate pins & delete
      getPins(data, response);
      findDupPins(data);
    } else if (response.status === 'not_authorized') {
      document.getElementById('show').innerHTML = 'You are not connected. Please try again.';
    } else {
      document.getElementById('show').innerHTML = 'You are logged into any Pinterest account.';
    }
  });
}

// Determine auth state of the user
function loggedIn() {
  return !!PDK.getSession();
}

// Pinterest log out
function logOut() {
  PDK.logout();
}

// Return's the  authorized user’s profile, boards and pins
function userInfo() {
  PDK.me();
}

// Request a search for User's boards
function myBoards(callback) {
  PDK.me('boards', { fields: 'id,name,image[small]' }, callback);
}

// Return description and image of the pin
var params = {
  fields: 'note,image'
};

// Retrieve pins on the board
var pins = [];
function getPins(data, callback) {
  PDK.request('/boards/Techies/pins', 'GET', function (response) { // TEMP BOARD : Techies
    if (!response || response.error) {
      alert('Error occurred');
    } else {
      pins = pins.concat(response.data);
      console.log(pins); // TEST to see if pins are showing up
      if (response.hasNext) {
        response.next(); // this will recursively go to this same callback
      }
    }
  });
  return pins;
}
