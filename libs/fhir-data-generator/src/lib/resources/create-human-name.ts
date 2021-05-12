import {HumanNameUseKind, IHumanName} from "@ahryman40k/ts-fhir-types/lib/R4";
import navfaker from "nav-faker";
import {randomFamilyName} from "../utils/random-family-name";

export function createHumanName(gender): IHumanName {
    const given = navfaker.navn.fornavn(gender);
    const family = randomFamilyName();
    const fullName = given + " " + family;

    return {
        use: HumanNameUseKind._official,
        text: fullName,
        family: family,
        given: [
            given
        ]
    }
}



