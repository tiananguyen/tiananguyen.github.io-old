// Initialize once with app id
PDK.init({ appId: '4976224077197881480', cookie: true });

// Determine auth state of the user
function loggedIn() {
  return !!PDK.getSession();
}

// Pinterest log out
function logOut() {
  PDK.logout();
}

// Deleting a pin
function deletePin(data, callback) {
  PDK.request('/pins/', 'DELETE', data, callback);
}

// Find duplicate pins
function findDupPins(data) {
  for (var i = 0; i < pins.length; i++) {
    for (var j = 0; j < pins.length; j++) {
      if (j != i) {
        if (pins[i] == pins[j]) {
          deletePin(pins[i], function(response){});
        }
      }
    }
  }
}

function pinterest() {
  // Function to log into user's Pinterest
  PDK.login({ scope : 'write_public, read_public' }, function(response) {
    console.log(response);  // TEST TO SEE STATUS

    // Display the status of their login
    if (response.error || !response) {
      document.getElementById('show').innerHTML = 'You are not connected. Please try again.';
    } else {
      document.getElementById('show').innerHTML = 'You are connected! We will now be deleting duplicate pins.';
      var user_id;
      PDK.request('/v1/me/', 'GET', { fields: 'username' }, function(response) { // Get user information
          user_id = response;
      });
      user_id = 'tiananguyen99'; // TEMP USERNAME
      // Ask user for which board user wants to search
      var board_id = prompt("Which board do you want to search?");
      board_id='cooking-sessions'; // TEMP BOARD
      var pins = [];
      PDK.request('/boards/'+ user_id +'/'+ board_id +'/pins/', { fields: 'note,image[small]' }, function (response) {  // Get board information
          if (!response || response.error) {
            alert('Error occurred');
          } else {
            pins = pins.concat(response.data);
            if (response.hasNext) {
              response.next();
            }
          }
      });
      // Display pins
      for(var i = 0; i< pins.length; i++) {
        document.getElementById('show').innerHTML = pins[i];
      }

      // Look for duplicate pins & delete
      findDupPins(pins);
    }
  });
}
