const axios = require('axios').default;
const url = require('url');
const { rejects } = require('assert');

/**
 * @name AppNexusApi
 * @class
 * Wrapper for the AppNexus (Xandr) Rest Api
 * https://docs.xandr.com/bundle/xandr-api/page/api-getting-started.html 
*/
module.exports = class AppNexusApi {
    /**
     * @constructor
     * @function
     * @param {JiraApiOptions} options
     */
    constructor(options) {
        this.protocol = options.protocol || 'https';
        this.host = options.host || 'api.appnexus.com';
        this.port = options.port || null;
        this.username = options.username;
        this.password = options.password;
    }

    /**
     * @name auth
     * @function
     * Attempts to authenticate with AppNexus.  Upon successful authentication returns the 
     * provided token to make subsequennt calls.  Note that a token can be used for up to 2 hours.
     * https://docs.xandr.com/bundle/xandr-api/page/authentication-service.html
     */
    async login(username, password) {
        var credentials = { 
            auth: {
                username: username,
                password: password
            }
        };
        const authUrl = this.makeUri("auth");
        const serverResponse = await axios.post(authUrl, credentials);
        if (this.statusOk(serverResponse)) { 
            return serverResponse.data.response.token;
        }
        throw new Error(serverResponse.data.response.error);
    }

    statusOk(body) {
        return !!body && !!body.data.response && body.data.response.status === 'OK';
    }

    /**
     * @name makeUri
     * @function
     * Creates a URI object for a given pathname
     * @param {string} pathname - a string containing the path to append to the URL. It should not contain a '/'
     * @param {string} query 
     * @param {boolean} encode - whether or not to encode the URL
     */
    makeUri(pathname, query, encode = false) {
        const uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port,
            pathname: pathname,
            query,
        });
        return encode ? encodeURI(uri) : decodeURIComponent(uri);
    }


}