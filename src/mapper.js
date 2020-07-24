const AppNexusApi = require('./AppNexusApi.js');

var appNexus = new AppNexusApi({});

// appNexus.login("jaisovrn", "J@1sovrn123")
//     .then(t => { console.log(t); });
    
(async () => {
    try{
        var token = await appNexus.login("jaisovrn", "J@1sovrn123");
        console.log("Login token:" + token);
    }
    catch(e){
        console.error("Unable to login." + e);
    }
})();