import {ProtocolRequest, ProtocolResponse} from "electron";
// @ts-ignore
import metaData from "../metadata.json";

const fhirMetadata = (request: ProtocolRequest, response: ProtocolResponse): ProtocolResponse => {
    response.data = JSON.stringify(metaData);
    return response
}

export default fhirMetadata;
