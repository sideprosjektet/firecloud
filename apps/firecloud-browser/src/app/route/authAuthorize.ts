import {ProtocolRequest, ProtocolResponse} from "electron";
import authorize from "./oauth2/authorize";

const authAuthorize = async (request: ProtocolRequest, response: ProtocolResponse): Promise<ProtocolResponse> => {

    return await authorize(request, response);
}

export default authAuthorize;
