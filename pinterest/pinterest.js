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

// Search through pins and delete duplicates
function pinterest() {
  PDK.login({ scope : 'write_public, read_public' }, function(response) {   // Function to log into user's Pinterest

    console.log(response);  // TEST

    // Display the status of their login
    if (response.error || !response) {
      document.getElementById('show').innerHTML = 'You are not connected. Please try again.';
    } else {
      document.getElementById('show').innerHTML = 'You are connected! We will now begin the process of deleting duplicate pins.';

      PDK.me({ fields: 'username' }, function(response) { // Get user information
          console.log(response); // TEST
          console.log("Test 2"); // TEST
      });

      // Ask user for which board user wants to search\
      var user_id = prompt("Please enter your username below");
      var board_id = prompt("Which board do you want to search?");
      var pins = [];
      var pinsDelete = [];

      console.log("Test 3"); // TEST

      PDK.request('/boards/'+ user_id +'/'+ board_id +'/pins/', { fields: 'note,image[small],url' }, function (response) {  // Get board information

          console.log(response); // TEST
          console.log("Test 4"); // TEST

          // Look for duplicate pins
          for (var i = 0; i < response.data.length; i++) {
            for (var j = i + 1; j < response.data.length; j++) {
              if ((j != i) && (response.data[j].note == response.data[i].note)) {
                console.log(response.data[j].url); // TEST
                var newURL = response.data[j].url;
                document.getElementById("display").href = newURL; // Display pins
                pinsDelete = pinsDelete.concat(response.data[j]);
                PDK.request('/v1/pins/' + response.data[j].id + '/', 'DELETE', response.data, function(response){});
              }
            }
          }

          // Get next pins
          if (!response || response.error) {
            alert('Error occurred');
          } else {
            pins = pins.concat(response.data);
            // var output = document.getElementById('output');
            // output.innerHTML = pinsDelete;
            if (response.hasNext) {
              response.next();
            }
          }
      });
    }
    //document.getElementById('show').innerHTML = 'Duplicate pins deleted. Check your Pinterest board!';
  });
}
