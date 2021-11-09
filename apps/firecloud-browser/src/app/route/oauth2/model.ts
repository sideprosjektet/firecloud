import * as OAuth2Server from "oauth2-server";
import {AuthorizationCodeModel, User} from "oauth2-server";

const db = { // Here is a fast overview of what your db model should look like
    authorizationCode: {
        authorizationCode: '', // A string that contains the code
        expiresAt: new Date(), // A date when the code expires
        redirectUri: '', // A string of where to redirect to with this code
        client: null, // See the client section
        user: null, // Whatever you want... This is where you can be flexible with the protocol
    },
    client: { // Application wanting to authenticate with this server
        id: '', // Unique string representing the client
        clientSecret: '', // Secret of the client; Can be null
        grants: [], // Array of grants that the client can use (ie, `authorization_code`)
        redirectUris: [], // Array of urls the client is allowed to redirect to
    },
    token: {
        accessToken: '', // Access token that the server created
        accessTokenExpiresAt:new Date(new Date().getTime() + 1000000), //the token expires
        refreshToken: null,
        refreshTokenExpiresAt: null,
        client: null, // Client associated with this token
        user: null, // User associated with this token
    },
}

const model: AuthorizationCodeModel = {
    async getAccessToken(token: string): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
        if (!token || token === 'undefined') {
            return Promise.resolve(false)
        } else {
            const user: User = {}
            db.token.user = user
            return new Promise(resolve => resolve(db.token))
        }
    },
    getAuthorizationCode(authorizationCode: string): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
        return new Promise(resolve => {
            resolve(db.authorizationCode)
        })
    },
    getClient(clientId: string, clientSecret: string): Promise<OAuth2Server.Client | OAuth2Server.Falsey> {
        db.client = { // Retrieved from the database
            id: clientId,
            clientSecret: clientSecret,
            grants: ['authorization_code', 'refresh_token'],
            redirectUris: [
                'https://launch.smarthealthit.org/sample-app/',
                'http://localhost:3030/client/app',
            ],
        }
        return new Promise(resolve => {
            resolve(db.client)
        })
    },
    revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode): Promise<boolean> {
        return Promise.resolve(false);
    },
    saveAuthorizationCode(
        code: Pick<OAuth2Server.AuthorizationCode, "authorizationCode" | "expiresAt" | "redirectUri" | "scope">,
        client: OAuth2Server.Client,
        user: OAuth2Server.User
    ): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
        db.authorizationCode = {
            authorizationCode: code.authorizationCode,
            expiresAt: code.expiresAt,
            client: client,
            user: user,
            redirectUri: code.redirectUri
        }
        return new Promise(resolve => resolve(db.authorizationCode))
    },
    saveToken(token: OAuth2Server.Token, client: OAuth2Server.Client, user: OAuth2Server.User): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
        db.token = {
            accessToken: token.accessToken,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            refreshToken: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
            refreshTokenExpiresAt: token.refreshTokenExpiresAt,
            client: client,
            user: user,
        }
        return new Promise(resolve => resolve(db.token))
    },
    verifyScope(token: OAuth2Server.Token, scope: string | string[]): Promise<boolean> {
        const userHasAccess = true  // return true if this user / client combo has access to this resource
        return new Promise(resolve => resolve(userHasAccess))
    }

};

export default model;
