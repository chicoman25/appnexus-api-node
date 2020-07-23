const axios = require('axios').default;
const url = require('url');

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
    async auth() {
        const authUrl = this.makeUri("auth");
        const requestConfig = {
            url: this.makeUri("auth"),
            method: "POST",
            data: this.makeCredentialsJson(this.username, this.password),
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };
        const serverResponse = await axios(requestConfig)
        const jsonResponse = serverResponse.data.response
        if (jsonResponse.error_id) { 
            console.error("I got an error: " + jsonResponse.error);
            throw new Error(jsonResponse.error);
        }
        else {
            return jsonResponse.token;
        }
    }

    makeCredentialsJson(user, pass) {
        return {
            auth: {
                username: user,
                password: pass
            }
        };
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