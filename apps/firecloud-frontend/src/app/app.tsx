import styled from 'styled-components';

import {ReactComponent as Logo} from './logo.svg';
import {ipcRenderer} from "electron"
import star from './star.svg';
import axios from "axios";

const StyledApp = styled.div`
  font-family: sans-serif;
  min-width: 300px;
  margin: 0;

  .gutter-left {
    margin-left: 9px;
  }

  .col-span-2 {
    grid-column: span 2;
  }

  .flex {
    display: flex;
  }

  header {
    background-color: #143055;
    color: white;
    padding: 5px;
    border-radius: 3px;
  }

  main {
    padding: 0 36px;
  }

  p {
  }

  h1 {
    margin-left: 18px;
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
    margin: 40px 0 10px 0;
  }

  .resources {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 9px;
    grid-template-columns: 1fr 1fr;
  }

  .resource {
    color: #0094ba;
    height: 36px;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 3px 9px;
    text-decoration: none;
  }

  .resource:hover {
    background-color: rgba(68, 138, 255, 0.04);
  }

  pre {
    padding: 9px;
    border-radius: 4px;
    background-color: black;
    color: #eee;
  }

  details {
    border-radius: 4px;
    color: #333;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 3px 9px;
    margin-bottom: 9px;
  }

  summary {
    outline: none;
    height: 36px;
    line-height: 36px;
  }

  .github-star-container {
    margin-top: 12px;
    line-height: 20px;
  }

  .github-star-container a {
    display: flex;
    text-decoration: none;
    color: #333;
  }

  .github-star-badge {
    color: #24292e;
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    border: 1px solid rgba(27, 31, 35, 0.2);
    border-radius: 3px;
    background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
    margin-left: 4px;
    font-weight: 600;
  }

  .github-star-badge:hover {
    background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);
    border-color: rgba(27, 31, 35, 0.35);
    background-position: -0.5em;
  }

  .github-star-badge .material-icons {
    height: 16px;
    width: 16px;
    margin-right: 4px;
  }
`;

function changeUrl() {
    ipcRenderer.send("change-url", "new url")
}

async function testFhirUrl() {
    const res = await axios.get("fhir://something-server/auth/authorize?client_id=whatever&response_type=code&scope=patient%2F*.*%20user%2F*.*%20launch%20openid%20fhirUser%20profile%20offline_access&redirect_uri=https%3A%2F%2Flaunch.smarthealthit.org%2Fsample-app%2F&state=414cc130-b9fa-caa4-bf6c-e7dbf896cfcc&aud=fhir%3A%2F%2Fsomething-else%2Ffhir&launch=%7B%22some%22%3A%22data%22%7D");
    console.log(res.data)
}

export function App() {
    return (
        <StyledApp>
            <header className="flex">
                <Logo width="75" height="75"/>
                <h1>Welcome to firecloud-frontend!</h1>
            </header>
            <main>
                <pre>
          hello
        </pre>

                If you like Nx, please give it a star:
                <button className="github-star-badge" onClick={changeUrl}>
                    <img src={star} className="material-icons" alt=""/>
                    Star
                </button>
                <br/>
                <button className="github-star-badge" onClick={testFhirUrl}>
                    Test
                </button>
            </main>
        </StyledApp>
    );
}

export default App;
