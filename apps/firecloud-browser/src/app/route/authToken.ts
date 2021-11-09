import {ProtocolRequest, ProtocolResponse} from "electron";

const authToken = async (request: ProtocolRequest, response: ProtocolResponse): Promise<ProtocolResponse> => {
    console.log(request.uploadData);
    return response;
}

export default authToken;
