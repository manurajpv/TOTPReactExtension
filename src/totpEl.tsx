import React from "react";
import "./totpEl.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect } from "react";
import ls from "localstorage-slim";
import CardElem from "./appElement";
const totp = require("totp-generator");

ls.config.encrypt = true;
interface Props {
  keyValue: string | null;
}

interface secret {
  key:string|any,
  progress:number
}

const TOTPElement: React.FC<Props> = ({ keyValue }) => {
  const [key, updateKey] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [keyInpErr, setKeyInpErr] = useState("");

  const saveKey = (keyVal: string) => {
    if (keyVal === "" || keyVal.trim().length < 10) {
      setKeyInpErr("Invalid Secret Key");
      return;
    }
    setKeyInpErr("");
    ls.set("savedKey", keyVal);
    window.location.reload();
  };
  const removeKey =()=>{
    console.log("cleared");
    ls.clear();
  }
  const getCurrentElapsedTime = () => {
    var d = new Date();
    var seconds = Math.round(d.getTime() / 1000);
    return seconds % 30;
  };
  const getKeyAndCode = (keyValue:string|null) => {
    try {
      const token = totp(keyValue);
      return token;
    } catch (error) {
      return false;
    }
  };
  const useProgress = (maxTimeInSeconds = 30) => {
    useEffect(() => {
      setElapsedTime(getCurrentElapsedTime());
      const intervalId = setInterval(() => {
        setElapsedTime((t) => t + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }, []);
    return (elapsedTime % maxTimeInSeconds) / maxTimeInSeconds;
  };

  const progress = useProgress();
  console.log(progress);
  const isSavedKey = ls.get("savedKey");
  const passProps:secret = {key:getKeyAndCode(keyValue),progress:progress}
  if (isSavedKey === null || getKeyAndCode(keyValue) === false)
    return (
      <div>
        <Box
          component="div"
          sx={{
            "& > :not(style)": { m: 1, width: "80%" },
          }}
        >
          <TextField
            id="codeInput"
            label="Enter Your Key"
            variant="outlined"
            value={key}
            size="small"
            error={keyInpErr === "" ? false : true}
            helperText={keyInpErr === "" ? "" : keyInpErr}
            onChange={(e) => updateKey(e.target.value)}
          />

          <Button
            variant="contained"
            disableElevation
            onClick={(e) => saveKey(key)}
            size="medium"
            sx={{ m: "1rem" }}
          >
            Submit
          </Button>
        </Box>
      </div>
    );
  else
    return (
      <div>
        <CardElem secret={passProps} />
        <Button
          variant="contained"
          disableElevation
          onClick={(e) => removeKey()}
          size="medium"
          sx={{ m: "1rem" }}
          color="error"
        >
          Reset
        </Button>
      </div>
    );
};

export { TOTPElement };
