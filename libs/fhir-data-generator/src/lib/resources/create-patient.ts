import {IdentifierUseKind, IIdentifier, IPatient, PatientGenderKind} from "@ahryman40k/ts-fhir-types/lib/R4";
import navfaker from "nav-faker";
import {v4 as uuidv4} from 'uuid';
import {createHumanName} from "./create-human-name";
import {Kjønn} from "nav-faker/dist/personidentifikator/personIdentifikator";

export function createPatient(): IPatient {
    const genderNumber = navfaker.person.kjønn()
    const fnr = navfaker.personIdentifikator.fødselsnummer(null, genderNumber)
    const identifier: IIdentifier = {
        use: IdentifierUseKind._official,
        system: "urn:oid:2.16.578.1.12.4.1.4.1",
        value: fnr
    }
    const birthDate = navfaker.personIdentifikator
        .getFødselsdato(fnr)
        .toISOString()
        .substr(0, 10);

    return {
        id: uuidv4(),
        resourceType: "Patient",
        identifier: [identifier],
        name: [createHumanName(genderNumber)],
        gender: genderNrToText(genderNumber),
        birthDate,
        deceasedBoolean:false,
        active:true,

    };
}

function genderNrToText(genderNr): PatientGenderKind {
    switch (genderNr) {
        case Kjønn.KVINNE:
            return PatientGenderKind._female;
        case Kjønn.MANN:
            return PatientGenderKind._male
        default:
            return PatientGenderKind._unknown
    }
}
