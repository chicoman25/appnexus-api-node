const AppNexusApi = require('./AppNexusApi.js');
const axios = require('axios');
jest.mock('axios');

const tooManyTriesResponse = {"response":{"error_id":"UNAUTH","error":"Your account has been locked because of too many failed attempts. Please wait five minutes and you will be able to try again.","dbg_info":{"instance":"authentication-api-production-5b5588d9dc-hphsw","time":22,"start_time":"2020-07-23T01:41:02.972Z","version":"0.0.0"}}}
const unauthorizedResponse = {"response":{"error_id":"UNAUTH","error":"No match found for username/password.","dbg_info":{"instance":"authentication-api-production-5b5588d9dc-cpk8g","time":24,"start_time":"2020-07-23T01:52:32.819Z","version":"0.0.0"}}}
const successfulAuthResponse = {"response":{"status":"OK","token":"authn:229936:d0edb7da610d3:lax1","dbg_info":{"instance":"authentication-api-production-5b5588d9dc-fgh9v","time":340,"start_time":"2020-07-23T12:56:45.072Z","version":"0.0.0"}}}

describe(__filename, () => {
  describe('Constructor Tests', () => {
    it('Constructor functions properly', () => {
      const appNexus = new AppNexusApi(getOptions());
      expect(appNexus.protocol).toEqual('https');
      expect(appNexus.host).toEqual('api.appnexus.com');
      expect(appNexus.port).toEqual('80');
    });
  });

  describe('makeUri Tests', () => {
    it('builds url with pathname, protocol, host, and defafult port', () => {
      const appNexus = new AppNexusApi(getOptions());
      expect(appNexus.makeUri("auth")).toEqual("https://api.appnexus.com:80/auth");
    });
  });

  describe('auth Tests', () => {
    const appNexus = new AppNexusApi(getOptions({}));
    it('returns a token upon successful auth', async () => {
      axios.mockResolvedValue({data: successfulAuthResponse});
      const response = await appNexus.auth();
      expect(response).toEqual(successfulAuthResponse.response.token);
    });

    // AppNexus suspends auth calls for 5 minutes after too many tries. 
    it('throws an error when auth fails with a response of too many tries', async () => {
      axios.mockResolvedValue({data: tooManyTriesResponse});
      const token = await appNexus.auth();
      console.log("Auth Response: " + token); 
      await expect(() => { appNexus.auth() }).toThrow();    
    });
  });

  function getOptions(options) {
    const actualOptions = options || {};
    return {
      protocol: actualOptions.protocol || 'https',
      host: actualOptions.host || 'api.appnexus.com',
      port: actualOptions.port || '80',
      request: actualOptions.request,
    }
  };
});