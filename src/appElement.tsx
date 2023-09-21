import React from "react";
import { FcGoogle } from "react-icons/fc";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import "./cardElem.css";

const totp = require("totp-generator");

interface secret {
  key: string|any,
  progress: number
}
const CardElem = (props: { secret: secret }) => {
  const data = {
    secret: "7MECYSFHGYG7KKYZ",
    label: "manuraj",
    issuer: "GitHub",
  };
  const code = "123456";

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
            <FcGoogle size={35} />
          </Grid>
          <Grid xs={8}>
            <div className="el-details">
              <span className="issuer-name">google</span>
              <p className="user-email">abcdef@gmail.com</p>
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
              value={100 - (props.secret.progress * 100)}
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
              <span className="sp-code">{props.secret.key[0]}</span>
              <span className="sp-code">{props.secret.key[1]}</span>
              <span className="sp-code">{props.secret.key[2]}</span>
              <span className="code-divider"></span>
              <span className="code-divider"></span>
              <span className="sp-code">{props.secret.key[3]}</span>
              <span className="sp-code">{props.secret.key[4]}</span>
              <span className="sp-code">{props.secret.key[5]}</span>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardElem;
