import React from "react";
import "./App.css";
import ls from "localstorage-slim";
import { TOTPElement } from "./totpEl";

function App() {

  const isSavedKey :Array<any> |null = ls.get("savedKey");
  console.log(isSavedKey);
  return (
    <div className="container">
      <div className="App">
        <h1 className="header">TOTP Authenticator</h1>
        <TOTPElement data={isSavedKey}/>
      </div>
    </div>
  );
}

export default App;
