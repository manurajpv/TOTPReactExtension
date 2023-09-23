import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { SiAuthelia } from "react-icons/si";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import * as OTPAuth from "otpauth";

import "./cardElem.css";

const totp = require("totp-generator");

const CardElem = (data: any) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [token, setToken] = useState("000000");
  const [authObject, setAuthObject] = useState<any>(
    OTPAuth.URI.parse(data.data)
  );
  const returnIcon = (issuer: string|any) => {
    switch(issuer.toLowerCase()){
      case "google":
        return <FcGoogle size={35} />;
      case "github":
        return <BsGithub size={35}/>;
      default:
        return <SiAuthelia size={35} />;
    }
  };
  const getKeyAndCode = (authString: string) => {
    try {
      const parsed = OTPAuth.URI.parse(authString);
      let tokenGen = parsed.generate();
      setToken(tokenGen);
      setAuthObject(parsed);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getCurrentElapsedTime = () => {
    var d = new Date();
    var seconds = Math.round(d.getTime() / 1000);
    return seconds % 30;
  };
  const useProgress = (maxTimeInSeconds = 30) => {
    useEffect(() => {
      setElapsedTime(getCurrentElapsedTime());
      const intervalId = setInterval(() => {
        setElapsedTime((t) => t + 1);
        getKeyAndCode(data.data);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }, []);
    return (elapsedTime % maxTimeInSeconds) / maxTimeInSeconds;
  };
  const progress = useProgress();
  console.log(progress);
  return (
    <div className="el-container">
      <div className="el-card">
        <Grid container spacing={1}>
          <Grid
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {returnIcon(authObject.issuer)}
          </Grid>
          <Grid xs={8} sx={{display:"flex",m:"1px 0px"}}>
            <div className="el-details">
              <span className="issuer-name">{authObject.issuer}</span>
              <p className="user-email">{authObject.label}</p>
            </div>
          </Grid>
          <Grid
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={30}
              thickness={6}
              variant="determinate"
              value={100 - progress * 100}
            />
          </Grid>
        </Grid>
        <div className="el-code-wrapper">
          <div className="el2-code">
            <Grid
              container
              spacing={1}
              sx={{ justifyContent: "space-around", margin: "15px 0 3px 0" }}
            >
              <span className="sp-code">{token[0]}</span>
              <span className="sp-code">{token[1]}</span>
              <span className="sp-code">{token[2]}</span>
              <span className="code-divider"></span>
              <span className="code-divider"></span>
              <span className="sp-code">{token[3]}</span>
              <span className="sp-code">{token[4]}</span>
              <span className="sp-code">{token[5]}</span>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardElem;
