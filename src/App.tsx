import React from "react";
import "./App.css";
import ls from "localstorage-slim";
import { TOTPElement } from "./totpEl";
import '@fontsource/roboto/700.css';

function App() {

  const isSavedKey :string|null = ls.get("savedKey");
  console.log(isSavedKey);
  return (
    <div className="container">
      <div className="App">
        <h1 className="header">TOTP Authenticator</h1>
        <TOTPElement keyValue={isSavedKey}/>
      </div>
    </div>
  );
}

export default App;
