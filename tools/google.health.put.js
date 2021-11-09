const {google} = require('googleapis');
const healthcare = google.healthcare('v1');
const fs = require('fs');

const putFhirResource = async () => {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const headers = {'Content-Type': 'application/fhir+json'};
  google.options({auth, headers});

  // TODO(developer): uncomment these lines before running the sample
  const cloudRegion = 'europe-west4';
  const projectId = 'helseopplysninger-dev-d4b0';
  const datasetId = 'hops';
  const fhirStoreId = 'exploding-rabbit';
  const resourceType = 'Patient';
  const resourceId = '16e8a860-33b3-49be-9b03-de979feed14a';
  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/fhirStores/${fhirStoreId}`;

  //const body = fs.readFileSync(__dirname + '/patient.json', 'utf-8');
  const data = {
    name: [{use: 'official', family: 'Smith', given: ['Darcy']}],
    gender: 'female',
    birthDate: '1981-01-01',
    resourceType: 'Patient',
  };

  const request = {parent, requestBody: data, type:resourceType};
  const resource = await healthcare.projects.locations.datasets.fhirStores.fhir.create(request);
  console.log(`Created FHIR resource with ID ${resource.data.id}`);
  console.log(resource.data);
};

putFhirResource();
