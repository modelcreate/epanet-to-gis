import React, {useState, useMemo, useEffect} from 'react';

//@ts-ignore
import geojson2svg from 'geojson2svg'
import EpanetGeoJSON from './interfaces/EpanetGeoJson';
import DropZoneArea from "./components/DropZoneArea"

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import GitHubIcon from '@material-ui/icons/GitHub';

import bbox from '@turf/bbox'
import { toShapeFile } from './util/EpanetGeoJsonToShp';
import {saveGeoJson}  from './util/saveGeoJson'
import * as Comlink from "comlink";


// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import RunToGeoJsonWorker from "worker-loader!./worker/runToGeoJson.worker";
import { RunToGeoJsonWorkerType } from "./worker/runToGeoJson.worker";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  modelName: {
    textAlign: 'center'
  },
  loadingDataLabel: {
    paddingTop:"10px"
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {

  const [epanetInp, setEpanetInp] = useState<string | undefined>(
    undefined
  );
  const [epanetGeoJson, setEpanetGeoJson] = useState<EpanetGeoJSON | undefined>(
    undefined
  );
  const [modelFilename, setModelFilename] = useState<string>("");
  const [loadingData, setLoadingData] = useState<boolean>(false)
  const [open, setOpen] = React.useState(false);


  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  
  const classes = useStyles();


  useEffect(() => {
    const startDummyWorker = async () => {
      if(epanetInp){
        setLoadingData(true);
        const worker = new RunToGeoJsonWorker();
        // Use Comlink's `wrap` function with the instance to get a function.
        const toGeoJson = Comlink.wrap<RunToGeoJsonWorkerType>(worker);
        // Invoke our function for a result like any Promise-returning function.
        try {
          const result = await toGeoJson(epanetInp);
          setEpanetGeoJson(result);
        } catch {
          setOpen(true);
        }
        
        
        setLoadingData(false);
      }
    };

    startDummyWorker();
  }, [epanetInp]);



  const svgStrings= useMemo(() => {

    if(epanetGeoJson) {

      const extents = bbox(epanetGeoJson)
      const [left, bottom, right, top] = extents
  
      const converter = geojson2svg(
        { 
          viewportSize: {width:800,height:800},
          attributes: {
            'style': 'stroke:#000000; stroke-width:1px;',
            'vector-effect':'non-scaling-stroke'
          },
          explode: false,
          mapExtent: {
            
          left,
          right,
          bottom,
          top
          }
        }
      );
  
      return converter.convert(epanetGeoJson)

    }

    return undefined

  },[epanetGeoJson]);


  return (
    <Container maxWidth="md">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          There was an error loading the INP file
        </Alert>
      </Snackbar>

      
      <Grid spacing={3} 
        container
      >
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" gutterBottom>
            EPANET to GIS
          </Typography>
          <Typography variant="body1" gutterBottom>
            Convert an EPANET hydraulic model to shapefiles or a GeoJSON file. Either drag an INP into the drop zone
            below or click the area to open a prompt to select the file. All geoprocessing is done locally and no data is sent to the server.
          </Typography>
          <Typography variant="body1" gutterBottom>
            This app is open-source and you can find the source code on GitHub, if submit any problems as issues on GitHub. The app uses epanet-js, a javascript
            conversion of the owa-epanet library, links to both projects are below. 
          </Typography>
          <Button
            variant="contained"
            color="default"
            size="small" 
            className={classes.button}
            startIcon={<GitHubIcon />}
            href="https://github.com/modelcreate/epanet-to-gis"
          >
            epanet-to-gis
          </Button>
          <Button
            variant="contained"
            color="default"
            size="small" 
            className={classes.button}
            startIcon={<GitHubIcon />}
            href="https://github.com/modelcreate/epanet-js"
          >
            epanet-js
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <DropZoneArea setEpanetInp={setEpanetInp} setModelFilename={setModelFilename} />
        </Grid>
        <Grid container xs={12} md={6} justifyContent="center" alignItems="center" >

          { loadingData &&
            <Grid container  direction="column" justifyContent="center" alignItems="center">
              <CircularProgress />
              
              <Typography variant="caption" display="block" className={classes.loadingDataLabel}>
              Loading data...
              </Typography>
            </Grid>
          }
          { epanetGeoJson && svgStrings && loadingData === false &&
            <>
            <Typography className={classes.modelName} variant="h5" component="h2" gutterBottom>
              {modelFilename}
            </Typography>
            <Grid container justifyContent="center" className={classes.root}>
              <Button variant="contained"  size="small" color="primary" onClick={() => {toShapeFile(epanetGeoJson, modelFilename)}} >
                Export as Shapefiles
              </Button>
              <Button variant="contained"  size="small" color="primary" onClick={() => { saveGeoJson(epanetGeoJson, modelFilename)}} >
                Export as GeoJSON
              </Button>
            </Grid>
            <div id="mapArea">
              <div dangerouslySetInnerHTML={{__html: `<svg id="map" xmlns="http://www.w3.org/2000/svg" width="100%" height="350" viewBox="0 0 800 800">${svgStrings}</svg>`}} /> 
            </div>
            </>
          }



        </Grid>
      </Grid>

    </Container>
  );
}

export default App;
