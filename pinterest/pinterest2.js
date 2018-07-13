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
