import {IPatient} from "@ahryman40k/ts-fhir-types/lib/R4";
import {createPatient} from "./resources/create-patient";

export function fhirDataGenerator(): IPatient {

    return createPatient();
}
