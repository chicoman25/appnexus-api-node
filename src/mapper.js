const AppNexusApi = require('./AppNexusApi.js');

var appNexus = new AppNexusApi({});
var response = appNexus.auth();