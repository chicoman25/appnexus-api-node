const AppNexusApi = require('./AppNexusApi.js');

var appNexus = new AppNexusApi({});
    
(async () => {
    try{
        var token = await appNexus.login("jaisovrn", "J@1sovrn123");
        console.log("Login token:" + token);
    }
    catch(e){
        console.error("Unable to login." + e);
    }
})();