//@ts-ignore
import shpWrite from 'hwbllmnn-shp-write'
import JSZip from 'jszip';
import EpanetGeoJSON, {
    NodeCategories,
    LinkCategories
} from '../../interfaces/EpanetGeoJson';
import { saveAs } from 'file-saver';



export function toShapeFile(geoJson: EpanetGeoJSON, filename: string) {

    const zip = new JSZip()

    const polylineCategories: LinkCategories[] = ["Pipe", "Valve", "Pump"]
    const pointCategories:NodeCategories[]  = ["Junction", "Tank", "Reservior"]

    polylineCategories.forEach( cat => {
        writeShapeData( geoJson, cat, "POLYLINE", zip) 
    })

    pointCategories.forEach( cat => {
        writeShapeData( geoJson, cat, "POINT", zip) 
    })

    zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE'
      }).then(function(content) {
          console.log(content)
          saveAs(content, `${filename}.zip`);
        });

}

type GeometryType = "POINT" | "POLYLINE"

function writeShapeData( geoJson: EpanetGeoJSON, category:NodeCategories|LinkCategories, type: GeometryType, zip:JSZip) {

    const filteredData = geoJson.features.filter( f => f.properties.category === category)
    if(filteredData.length >0 ){
        
        const geom = filteredData.map( f => type === "POLYLINE" ? [f.geometry.coordinates] : f.geometry.coordinates)
        const data = filteredData.map( f => f.properties)
        
        shpWrite.write( data, type, geom, addFilesToZip(category.toLowerCase(), zip))
    }

}

function addFilesToZip(fileName:string, zip:JSZip) {

    return (err:Error, files:any) => {
        zip.file(fileName + '.shp', files.shp.buffer, { binary: true })
        zip.file(fileName + '.shx', files.shx.buffer, { binary: true })
        zip.file(fileName + '.dbf', files.dbf.buffer, { binary: true })
    }

}