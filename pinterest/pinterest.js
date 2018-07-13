// Initialize once with app id
PDK.init({ appId: '4976224077197881480', cookie: true });

// Pinterest log in
function login() {
  PDK.login(function(response) {
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

// Deleting a pin
function deletePin(data, callback) {
  PDK.request('/pins/', 'DELETE', data, callback);
}

// Find duplicate pins
function findDupPins(data) {
  for (int i = 0; i < pins.length; i++) {
    for (int j = 0; j < pins.length; j++) {
      if (j != i) {
        if (pins[i] == pins[j]) {
          deletePin(pins[i], function(response));
        }
      }
    }
  }
}
