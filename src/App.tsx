import React, {useState, useMemo, useEffect} from 'react';
import { toGeoJson } from './util/inpToGeoJson';
import './App.css';
//@ts-ignore
import geojson2svg from 'geojson2svg'
import EpanetGeoJSON from './interfaces/EpanetGeoJson';
import DropZoneArea from "./components/DropZoneArea"


import bbox from '@turf/bbox'
import { toShapeFile } from './util/EpanetGeoJsonToShp';
import {saveGeoJson}  from './util/saveGeoJson'
import * as Comlink from "comlink";


// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import RunToGeoJsonWorker from "worker-loader!./worker/runToGeoJson.worker";
import { RunToGeoJsonWorkerType } from "./worker/runToGeoJson.worker";


function App() {

  const [epanetInp, setEpanetInp] = useState<string | undefined>(
    undefined
  );
  const [epanetGeoJson, setEpanetGeoJson] = useState<EpanetGeoJSON | undefined>(
    undefined
  );

  const [loadingData, setLoadingData] = useState<boolean>(false)



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
            'style': 'stroke:#000000; fill: #0000FF;stroke-width:1px;',
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
    <div className="App">
      <DropZoneArea setEpanetInp={setEpanetInp} />
      { loadingData &&
        <span>Loading Data...</span>
      }
      { epanetGeoJson && svgStrings && loadingData === false &&
        <>
        <div id="mapArea">
          <div dangerouslySetInnerHTML={{__html: `<svg id="map" xmlns="http://www.w3.org/2000/svg" width="500" height="500" x="0" y="0">${svgStrings}</svg>`}} /> 
        </div>
        <button onClick={() => {toShapeFile(epanetGeoJson)}} > Export as Zip </button>
        <button onClick={() => { saveGeoJson(epanetGeoJson, "export")}} > Export as GeoJSON </button>
        </>
      }
    </div>
  );
}

export default App;
