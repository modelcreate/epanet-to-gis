import React, {useState, useMemo} from 'react';
import { toGeoJson } from './util/inpToGeoJson';
import './App.css';
//@ts-ignore
import geojson2svg from 'geojson2svg'
import EpanetGeoJSON from './interfaces/EpanetGeoJson';
import DropZoneArea from "./components/DropZoneArea"


import bbox from '@turf/bbox'
import { toShapeFile } from './util/EpanetGeoJsonToShp';
import {saveGeoJson}  from './util/saveGeoJson'






function App() {

  const [epanetInp, setEpanetInp] = useState<string | undefined>(
    undefined
  );


  const geoJson = useMemo(() => {
    
    if (epanetInp !== undefined) {
      return toGeoJson(epanetInp)
    }
    
    return undefined;
  }, [
    epanetInp
  ]);

  const svgStrings= useMemo(() => {

    if(geoJson) {

      const extents = bbox(geoJson)
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
  
  
      return converter.convert(geoJson)

    }

    return undefined

  },[geoJson]);


  return (
    <div className="App">
      <DropZoneArea setEpanetInp={setEpanetInp} />
      { geoJson && //svgStrings &&
        <>
        <div id="mapArea">
          <div dangerouslySetInnerHTML={{__html: `<svg id="map" xmlns="http://www.w3.org/2000/svg" width="500" height="500" x="0" y="0">${svgStrings}</svg>`}} /> 
        </div>
        <button onClick={() => {toShapeFile(geoJson)}} > Export as Zip </button>
        <button onClick={() => { saveGeoJson(geoJson, "export")}} > Export as GeoJSON </button>
        </>
      }
    </div>
  );
}

export default App;
