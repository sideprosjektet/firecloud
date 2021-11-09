import {ProtocolRequest, ProtocolResponse} from "electron";
import * as OAuth2Server from "oauth2-server";
import oauthServer from "./server";


const authorize = async (
    protocolRequest: ProtocolRequest,
    protocolResponse: ProtocolResponse
): Promise<ProtocolResponse> => {
    const reqUrl = new URL(protocolRequest.url);
    const state = reqUrl.searchParams.get("state");
    const query = {}
    reqUrl.searchParams.forEach((value, key) => {
        query[key] = value
    })
    const oauthReq = new OAuth2Server.Request({
        headers: {Authorization: 'Bearer foobar'},
        method: protocolRequest.method,
        query
    })
    oauthReq.headers["Authorization"] = 'Bearer foobar'
    const oauthRes = new OAuth2Server.Response({
        headers: protocolResponse.headers,
    })
    const authorizeResult = await oauthServer.authorize(oauthReq, oauthRes);
    const redirectUri = new URL(authorizeResult.redirectUri);
    redirectUri.searchParams.set("code", authorizeResult.authorizationCode);
    redirectUri.searchParams.set("state", state);
    protocolResponse.headers["location"] = redirectUri.toString()
    protocolResponse.statusCode = 302;
    return protocolResponse;
}

export default authorize;
