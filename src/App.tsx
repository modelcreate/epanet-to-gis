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

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


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
}));


function App() {

  const [epanetInp, setEpanetInp] = useState<string | undefined>(
    undefined
  );
  const [epanetGeoJson, setEpanetGeoJson] = useState<EpanetGeoJSON | undefined>(
    undefined
  );
  const [modelFilename, setModelFilename] = useState<string>("");

  const [loadingData, setLoadingData] = useState<boolean>(false)

  
  const classes = useStyles();


  useEffect(() => {
    const startDummyWorker = async () => {
      if(epanetInp){
        setLoadingData(true);
        const worker = new RunToGeoJsonWorker();
        // Use Comlink's `wrap` function with the instance to get a function.
        const toGeoJson = Comlink.wrap<RunToGeoJsonWorkerType>(worker);
        // Invoke our function for a result like any Promise-returning function.
        const result = await toGeoJson(epanetInp);
        setEpanetGeoJson(result);
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


      
      <Grid spacing={3} 
        container
      >
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" gutterBottom>
            EPANET to GIS
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
            unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
            dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <DropZoneArea setEpanetInp={setEpanetInp} setModelFilename={setModelFilename} />
        </Grid>
        <Grid item xs={12} md={6} >

          { loadingData &&
            <>
              <CircularProgress />
              <span>Loading Data...</span>
            </>
          }
          { epanetGeoJson && svgStrings && loadingData === false &&
            <>
            <Typography className={classes.modelName} variant="h5" component="h2" gutterBottom>
              {modelFilename}
            </Typography>
            <Grid container justifyContent="center"className={classes.root}>
              <Button variant="contained"  size="small" color="primary" onClick={() => {toShapeFile(epanetGeoJson, modelFilename)}} >
                Export as Shapefiles
              </Button>
              <Button variant="contained"  size="small" color="primary" onClick={() => { saveGeoJson(epanetGeoJson, modelFilename)}} >
                Export as GeoJSON
              </Button>
            </Grid>
            <div id="mapArea">
              <div dangerouslySetInnerHTML={{__html: `<svg id="map" xmlns="http://www.w3.org/2000/svg" width="500" height="500" x="0" y="0">${svgStrings}</svg>`}} /> 
            </div>
            </>
          }



        </Grid>
      </Grid>

    </Container>
  );
}

export default App;
