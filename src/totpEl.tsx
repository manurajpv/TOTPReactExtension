import React from "react";
import "./totpEl.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect } from "react";
import ls from "localstorage-slim";
const totp = require("totp-generator");

ls.config.encrypt = true;
interface Props {
  keyValue: string | null;
}

const TOTPElement: React.FC<Props> = ({ keyValue }) => {
  const [key, updateKey] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const saveKey = (keyVal: string) => {
    console.log(keyVal);
    if (keyVal === "" || keyVal.trim().length < 10) {
      alert("invalid Secret Key");
      return;
    }
    ls.set("savedKey", keyVal);
    window.location.reload();
  };
  const getCurrentElapsedTime = () => {
    var d = new Date();
    var seconds = Math.round(d.getTime() / 1000);
    console.log(seconds % 30);
    return seconds % 30;
  };
  const getKeyAndCode = () => {
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
  if (isSavedKey === null || getKeyAndCode() === false)
    return (
      <div>
        <Box
          component="div"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
        >
          <TextField
            id="codeInput"
            label="Enter Your Key"
            variant="outlined"
            value={key}
            onChange={(e) => updateKey(e.target.value)}
          />

          <Button
            variant="contained"
            disableElevation
            onClick={(e) => saveKey(key)}
          >
            Submit
          </Button>
        </Box>
      </div>
    );
  else
    return (
      <div>
        <Box>
          <label htmlFor="generatedKey"></label>
          <span id="generatedKey" className="generatedKey">
            {getKeyAndCode()}
          </span>
          <Box sx={{ width: "100%" , alignContent: "center"}}>
            <LinearProgress variant="determinate" value={progress*100} />
          </Box>
        </Box>
      </div>
    );
};

export { TOTPElement };
