//@ts-ignore
import shpWrite from 'hwbllmnn-shp-write'
import JSZip from 'jszip';
import EpanetGeoJSON from '../../interfaces/EpanetGeoJson';
import { saveAs } from 'file-saver';



export function toShapeFile(geoJson: EpanetGeoJSON) {

    // TODO: This could be DRY

    const zip = new JSZip()

    const pipes = geoJson.features.filter( f => f.properties.category === "Pipe")
    const pipesGeom = pipes.map( f => [f.geometry.coordinates])
    const pipesData = pipes.map( f => f.properties)

    shpWrite.write( pipesData , 'POLYLINE', pipesGeom, addFilesToZip("pipes", zip))

    const valves = geoJson.features.filter( f => f.properties.category === "Valve")
    const valvesGeom = valves.map( f => [f.geometry.coordinates])
    const valvesData = valves.map( f => f.properties)

    shpWrite.write( valvesData , 'POLYLINE', valvesGeom, addFilesToZip("valves", zip))

    const pumps = geoJson.features.filter( f => f.properties.category === "Valve")
    const pumpsGeom = pumps.map( f => [f.geometry.coordinates])
    const pumpsData = pumps.map( f => f.properties)

    shpWrite.write( pumpsData , 'POLYLINE', pumpsGeom, addFilesToZip("valves", zip))


    const junctions = geoJson.features.filter( f => f.properties.category === "Junction")
    const junctionsGeom = junctions.map( f => f.geometry.coordinates)
    const junctionsData = junctions.map( f => f.properties)

    shpWrite.write( junctionsData, 'POINT', junctionsGeom, addFilesToZip("junctions", zip))


    const tanks = geoJson.features.filter( f => f.properties.category === "Tank")
    const tanksGeom = tanks.map( f => f.geometry.coordinates)
    const tanksData = tanks.map( f => f.properties)

    shpWrite.write( tanksData, 'POINT', tanksGeom, addFilesToZip("tanks", zip))


    const reservior = geoJson.features.filter( f => f.properties.category === "Reservior")
    const reserviorGeom = reservior.map( f => f.geometry.coordinates)
    const reserviorData = reservior.map( f => f.properties)

    shpWrite.write( reserviorData, 'POINT', reserviorGeom, addFilesToZip("reserviors", zip))


    zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE'
      }).then(function(content) {
          console.log(content)
          saveAs(content, 'export.zip');
        });

}



function addFilesToZip(fileName:string, zip:JSZip) {

    return (err:Error, files:any) => {
        zip.file(fileName + '.shp', files.shp.buffer, { binary: true })
        zip.file(fileName + '.shx', files.shx.buffer, { binary: true })
        zip.file(fileName + '.dbf', files.dbf.buffer, { binary: true })
    }

}