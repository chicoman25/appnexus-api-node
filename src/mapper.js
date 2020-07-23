const AppNexusApi = require('./AppNexusApi.js');

var appNexus = new AppNexusApi({
    username: "jaisovrn",
    password: "J@1sovrn123"
});
var token = appNexus.auth();
console.log("Received response: " + token);