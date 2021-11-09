import {ProtocolRequest, ProtocolResponse} from "electron";
import axios from "axios";


const otherProxy = async (request: ProtocolRequest, response: ProtocolResponse): Promise<ProtocolResponse> => {
    const resp = await axios.get(request.url)
    response.headers = resp.headers
    response.data = resp.data;
    response.mimeType = resp.headers["content-type"]
    response.url = resp.config.url;
    return response
}

export default otherProxy;
