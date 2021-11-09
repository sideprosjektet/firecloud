import {BrowserView} from "electron";
import {logger} from "@nrwl/tao/src/shared/logger";
import * as jwt from "jsonwebtoken"
import * as crypto from "crypto";
const secretKey = crypto.randomBytes(48).toString('hex');

const createLaunchUrl = (appUrl, iss, launchContext) => {
    const baseUrl = new URL(appUrl);
    const params = {
        iss,
        launch: jwt.sign(launchContext,secretKey),
    };
    Object.keys(params).forEach(key => {
        baseUrl.searchParams.append(key, params[key]);
    });
    return baseUrl.toString();
}
const loadSofApp = async (browserView: BrowserView, appUrl) => {
    const localFhirEndpoint = "http+fhir://something-else/fhir"
    const urlToOpen = createLaunchUrl(
        appUrl,
        localFhirEndpoint,
        {
            some: "data"
        }
    )
    await browserView.webContents.loadURL(urlToOpen);
    logger.info(appUrl + " was opened");
}
export {
    createLaunchUrl,
    loadSofApp
}
