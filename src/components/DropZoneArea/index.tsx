import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import {useDropzone} from 'react-dropzone';

const useStyles = makeStyles((theme) => ({
  dropzone: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    color: "#5d5d5d",
    outline: "none",
    transition: "border .24s ease-in-out",
    minHeight: "450px",
    fontSize: "20px",
    fontFamily: "'Montserrat','Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.24px"
  },
  dropContainer: {
    paddingTop: "30px",
    paddingBottom: "30px",
  }

}));

interface DropZoneProps {
    setEpanetInp : (inp:string) => void,
  }

function DropZoneArea({ setEpanetInp }: DropZoneProps) {

    const classes = useStyles();

    const { getRootProps, getInputProps} = useDropzone({
      onDrop: (files) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
        // Do whatever you want with the file contents
          const binaryStr = reader.result  as string;
          setEpanetInp(binaryStr)
        }
        
        reader.readAsText(files[0]);
        
      }
    });
    
  
    return (
      <section   className={classes.dropContainer}>
        <div className={classes.dropzone}  {...getRootProps()} >
          <input {...getInputProps()} />
          <p>Drag 'n' drop EPANET INP to load model, or click to select file</p>
        </div>
      </section>
    );
  }

export default DropZoneArea