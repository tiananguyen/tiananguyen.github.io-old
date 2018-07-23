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

// Find duplicate pins
function findDupPins(data) {
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data.length; j++) {
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
    console.log(response);  // TEST

    // Display the status of their login
    if (response.error || !response) {
      document.getElementById('show').innerHTML = 'You are not connected. Please try again.';
    } else {
      document.getElementById('show').innerHTML = 'You are connected! We will now be deleting duplicate pins.';
      var user_id;
      PDK.me({ fields: 'username' }, function(response) { // Get user information
          user_id = response;
          console.log(response); // TEST
          console.log("Test 2"); // TEST
      });
      user_id = 'tiananguyen99'; // TEST USERNAME
      // Ask user for which board user wants to search
      var board_id = prompt("Which board do you want to search?");
      // board_id='test'; // TEST BOARD
      var pins = [];
      console.log("Test 3"); // TEST
      PDK.request('/boards/'+ user_id +'/'+ board_id +'/pins/', { fields: 'note,image[small]' }, function (response) {  // Get board information
          // TEST
          console.log(response);
          // console.log(response.data[0].url);
          console.log("Test 4");

          // Look for duplicate pins
          for (var i = 0; i < response.data.length; i++) {
            for (var j = i + 1; j < response.data.length; j++) {
              if ((j != i) && (response.data[j].note == response.data[i].note)) {
                  PDK.request('/v1/pins/' + response.data[j].id + '/', 'DELETE', response.data, function(response){});
              }
            }
          }

          // Get next pins
          if (!response || response.error) {
            alert('Error occurred');
          } else {
            pins = pins.concat(response.data);
            document.getElementById('show').innerHTML = response.data[0].image; // Display pins
            if (response.hasNext) {
              response.next();
            }
          }
      });
    }
  });
}
