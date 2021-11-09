const {google} = require('googleapis');
const healthcare = google.healthcare('v1');
const fs = require('fs');

const getFhirResource = async () => {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const headers = {'Content-Type': 'application/fhir+json'};
  google.options({auth, headers});

  const cloudRegion = 'europe-west4';
  const projectId = 'helseopplysninger-dev-d4b0';
  const datasetId = 'hops';
  const fhirStoreId = 'exploding-rabbit';
  const resourceType = 'Patient';

  const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/fhirStores/${fhirStoreId}`;

  const request = {parent, type: resourceType};
  const resource = await healthcare.projects.locations.datasets.fhirStores.fhir.search(request);
  console.log(`Searched got`, JSON.stringify(resource.data,null,4));
};

getFhirResource();
