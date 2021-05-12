import Client from "fhir-kit-client/lib/client"
import * as ClientImpl from 'fhir-kit-client';

export function createFhirClient(): Client {
    const baseUrl = "http://localhost:" + process.env.FHIR_SERVER_PORT + "/fhir";
    return new ClientImpl({baseUrl});
}
