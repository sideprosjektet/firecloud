import {randomFamilyName} from "./random-family-name";

describe('utility- tests', () => {
    it('should generate a random name', () => {
        const randomName = randomFamilyName()
        expect(typeof randomName).toEqual("string");
        expect(randomName.length).toBeGreaterThan(2);
    });
});
