import {ProtocolRequest, ProtocolResponse} from "electron";
import {createPatient} from "../../../../../libs/fhir-data-generator/src/lib/resources/create-patient";


const fhirProxy = async (request: ProtocolRequest, response: ProtocolResponse): Promise<ProtocolResponse> => {
    response.data = JSON.stringify(createPatient())
    return Promise.resolve(response)
}

export default fhirProxy;
