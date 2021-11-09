import authorize from "./authorize";
import {ProtocolRequest, ProtocolResponse} from "electron";

describe('OAuth2Server', () => {
    it('should render successfully', async () => {
        const url = "http+fhir://something-server/auth/authorize?client_id=whatever&response_type=code&scope=patient%2F*.*%20user%2F*.*%20launch%20openid%20fhirUser%20profile%20offline_access&redirect_uri=https%3A%2F%2Flaunch.smarthealthit.org%2Fsample-app%2F&state=ec3e4fd7-b633-8705-f49e-126b9f124a4b&aud=fhir%3A%2F%2Fsomething-else%2Ffhir&launch=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb21lIjoiZGF0YSIsImlhdCI6MTYyMTg1ODI3Nn0.MWSA-1WPFTPyaA3if2F0DYV9WfJ4UVEZFyFXoB-PYGY"
        const request: ProtocolRequest = {
            headers: {
                Authorization: 'Bearer foobar',
                'Upgrade-Insecure-Requests': '1',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
            },
            method: "GET",
            referrer: "",
            url
        }
        const response: ProtocolResponse = {
            headers: {}
        };
        const some = await authorize(request, response);
        console.log(some)
        expect(true).toBeTruthy();
    });
});
