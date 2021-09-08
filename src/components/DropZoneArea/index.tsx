import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles, useTheme  } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {FileWithPath, useDropzone} from 'react-dropzone';

interface DropzoneStyleProps {
  borderColor: string;
  minHeight: string;
}


const useStyles = makeStyles<Theme, DropzoneStyleProps>((theme: Theme) => ({
  dropzone: props => ({
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: props.borderColor,//"#eeeeee",
    borderStyle: "dashed",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    color: "#5d5d5d",
    outline: "none",
    transition: "border .24s ease-in-out",
    minHeight:  props.minHeight,
    fontSize: "20px",
    fontFamily: "'Montserrat','Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.24px"
  }),
  dropContainer: {
  }

}));

interface DropZoneProps {
    setEpanetInp : (inp:string) => void,
    setModelFilename : (inp:string) => void,
  }

function DropZoneArea({ setEpanetInp, setModelFilename }: DropZoneProps) {

    

    

    const { 
      isDragAccept,
      isDragActive,
      getRootProps,
      getInputProps
    } = useDropzone({
      maxFiles:1,
      multiple:false,
      onDrop: (files: FileWithPath[]) => {

        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
        // Do whatever you want with the file contents
          const inpFile = reader.result  as string;
          setEpanetInp(inpFile)
        }
        
        reader.readAsText(files[0]);
        //Regex removes extension
        setModelFilename(files[0].name.replace(/\.[^/.]+$/, ""))
      }
    });

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const styleProps:DropzoneStyleProps = { 
      borderColor: isDragActive ? isDragAccept ? "#2196f3": '#ff1744': "#eeeeee",
      minHeight: matches?  "450px":  "200px",
    };
    const classes = useStyles(styleProps);
    
  
    return (
      <section   className={classes.dropContainer}>
        <div className={classes.dropzone}  {...getRootProps()} >
          <input {...getInputProps()} />
          <p>Drop an EPANET model here, or click to select a file</p>
        </div>
      </section>
    );
  }

export default DropZoneArea