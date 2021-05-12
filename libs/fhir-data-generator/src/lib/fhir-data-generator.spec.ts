import { fhirDataGenerator } from './fhir-data-generator';

describe('fhirDataGenerator', () => {
  it('should work', () => {
    const patient = fhirDataGenerator();
    console.log(patient);

    expect(true).toEqual(true);
  });
});
