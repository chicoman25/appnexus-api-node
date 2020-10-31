const axios = require('axios').default;
const url = require('url');
const { rejects } = require('assert');

/**
 * @name AppNexusApi
 * @class
 * Wrapper for the AppNexus (Xandr) Rest Api.
 * https://docs.xandr.com/bundle/xandr-api/page/api-getting-started.html 
*/
module.exports = class AppNexusApi {
    /**
     * @constructor
     * @function
     * @param {XandrApiOptions} options
     */
    constructor(options) {
        this.protocol = options.protocol || 'https';
        this.host = options.host || 'api-test.appnexus.com';
        this.port = options.port || null;
        this.username = options.username;
        this.password = options.password;
        this.token = options.token || null;
    }

    /**
     * @name login
     * @function
     * Attempts to authenticate with AppNexus' Authentication service.  
     * Upon successful authentication sets the caches the token on this class and returns a promise encapsulating 
     * the token.  This token can be used to make make subsequennt calls within a 2 hour period before expiration.
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
            this.token = serverResponse.data.response.token;
            return this.token;
        }
        throw new Error(serverResponse.data.response.error);
    }

    statusOk(resp) {
        return !!resp && !!resp.data.response && resp.data.response.status === 'OK';
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
