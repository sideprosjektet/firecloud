import * as OAuth2Server from 'oauth2-server';
import model from "./model"

const oauthServer = new OAuth2Server({
    model
});


export default oauthServer;
