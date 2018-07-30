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
    console.log("Successful login! Here is the login information: ")
    console.log(response);

    // Display the status of their login
    if (response.error || !response) {
      document.getElementById('show').innerHTML = 'You are not connected. Please try again.';
    } else {

      PDK.me({ fields: 'username' }, function(response) { // Get user information
        console.log("Here is the user information: ");
        console.log(response);
      });
      document.getElementById('show').innerHTML = 'You are connected! We will now begin the process of deleting duplicate pins.';

      // Ask user for which board user wants to search
      var user_id = prompt("Please enter your username below");
      var board_id = prompt("Which board do you want to search?");
      var pins = [];
      var pinsDelete = [];

      PDK.request('/boards/'+ user_id +'/'+ board_id +'/', { fields: 'id,name,url' }, function (response) {  // Get board information
          console.log("Here is information about the board: ");
          console.log(response);

          // Display board
          document.getElementById("board").href = response.data.url;
      });

      PDK.request('/boards/'+ user_id +'/'+ board_id +'/pins/', { fields: 'note,image[small],url' }, function (response) {  // Get board pin information
          console.log("Here is the the list of data of the pins from the board: ");
          console.log(response);

          // Look for duplicate pins
          console.log("Here are the URLs to the duplicate pins: ");
          for (var i = 0; i < response.data.length; i++) {
            for (var j = i + 1; j < response.data.length; j++) {
              if ((j != i) && (response.data[j].note == response.data[i].note)) {
                console.log(response.data[i].url);

                // Display pins
                document.getElementById("display").href = response.data[i].url;

                // Delete duplicates
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
          
          document.getElementById('show').innerHTML = 'Duplicate pins deleted. Check your Pinterest board!';

          // Display board
          var newBoard = "\"" + "https://www.pinterest.com/" + user_id + "/" + board_id + "/" + "\"";
          document.getElementById("board").href = newBoard;
      });
    }
  });
}
