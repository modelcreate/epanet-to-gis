import React from 'react';

import {useDropzone} from 'react-dropzone';


interface DropZoneProps {
    setEpanetInp : (inp:string) => void,
  }

function DropZoneArea({ setEpanetInp }: DropZoneProps) {

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
      <section >
        <div  {...getRootProps()} >
          <input {...getInputProps()} />
          <p>Drag 'n' drop zip to load model, or click to select file</p>
        </div>
      </section>
    );
  }

export default DropZoneArea