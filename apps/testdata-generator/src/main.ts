import * as express from 'express';
import {createPatient} from "../../../libs/fhir-data-generator/src/lib/resources/create-patient";
import {createFhirClient} from "./utils/fhirclient";

const app = express();

app.get('/api', (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');
    res.send({
        env: baseUrl + "/env",
        ['/fhir/patient']: baseUrl + '/fhir/patient',
        fhirBaseUrl: "http://localhost:" + process.env.FHIR_SERVER_PORT + "/fhir",
        ['/server/capabilities']: baseUrl + '/server/capabilities',
    });
});
app.get('/env', (req, res) => {
    res.send(process.env);
});

app.get('/fhir/patient', (req, res) => {
    res.send(createPatient());
});

app.get('/add/patients', async (req, res) => {
    const patient = createPatient();
    const client = createFhirClient();
    await client.create({
        resourceType: 'Patient',
        body: patient,
    });
    res.send("patient " + patient.id + " was added to ");
});

app.get('/server/capabilities', async (req, res) => {
    const client = createFhirClient();
    const data = await client.capabilityStatement();
    res.send(data);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
