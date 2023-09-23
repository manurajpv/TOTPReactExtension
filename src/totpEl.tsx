import React from "react";
import "./totpEl.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ls from "localstorage-slim";
import CardElem from "./appElement";
import { Html5Qrcode } from "html5-qrcode";
import * as OTPAuth from "otpauth";

ls.config.encrypt = true;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const TOTPElement = (props: any) => {
  const [key, updateKey] = useState("");
  const [keyInpErr, setKeyInpErr] = useState("");
  const [file, setFile] = useState<File | any>(null);
  console.log("props ls key", props);
  const saveKey = (keyVal: any) => {
    setKeyInpErr("");
    try {
      let savedkeyVal: Array<any> | null = ls.get("savedKey");
      console.log(keyVal);
      if (savedkeyVal === null) savedkeyVal = [];
      savedkeyVal.push(keyVal);
      console.log(savedkeyVal);
      ls.set("savedKey", savedkeyVal);
    } catch (err) {
      console.log(err);
      keyVal = [];
      keyVal.push(keyVal);
      ls.set("savedKey", keyVal);
    }
    window.location.reload();
  };
  const removeKey = () => {
    console.log("cleared");
    ls.clear();
  };
  const getCodeFromImage = (imageFile: File) => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode
      .scanFile(imageFile, true)
      .then((decodedText) => {
        OTPAuth.URI.parse(decodedText);
        console.log(decodedText);
        saveKey(decodedText);
      })
      .catch((err) => {
        // failure, handle it.
        console.log(`Error scanning file. Reason: ${err}`);
        setKeyInpErr("Invalid Secret Key");
        return false;
      });
  };
  if (!props.data)
    return (
      <div>
        <Box>
          <div id="reader" style={{ width: "600px" }} hidden></div>

          <Button component="label" variant="contained">
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                setFile(e.target.files);
              }}
            />
          </Button>
        </Box>
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
            // onClick={(e) => saveKey(key)}
            onClick={(e) => {
              console.log(file);
              getCodeFromImage(file[0]);
            }}
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
      <>
        {props.data.map(function (data: string) {
          if (data)
            return (
              <div>
                <CardElem data={data} />
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
        })}
      </>
    );
};

export { TOTPElement };
