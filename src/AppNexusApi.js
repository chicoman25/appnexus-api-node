const request = require('request');
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
        // this is here to support testing.
        this.request = options.request || request;
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

    auth() {
        const authUrl = this.makeUri("auth");
        const requestOptions = {
            url: this.makeUri("auth"),
            method: "POST",
            body: JSON.stringify(this.getCredentials()),
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };

        const response = this.request(requestOptions, function (err, res, body) {
            if (err) {
                console.log("Server responded with an error: " + err);
            }
            else {
                console.log("Received Response: " + body);
                const resp = JSON.parse(body);
                if (resp.response.error_id) {
                    console.log("Received an error response: " + resp.response.error_id)
                }
            }
            return body;
        });
    }

    getCredentials() {
        return {
            "auth": {
                "username": "jaisovrnj",
                "password": "J@1sovrn123"
            }
        };
    }


}