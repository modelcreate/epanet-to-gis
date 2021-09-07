//@ts-ignore
import shpWrite from 'hwbllmnn-shp-write'
import JSZip from 'jszip';
import EpanetGeoJSON from '../../interfaces/EpanetGeoJson';
import { saveAs } from 'file-saver';



export function toShapeFile(geoJson: EpanetGeoJSON) {

    console.log(geoJson)

    const zip = new JSZip()

    const lineGeom = geoJson.features.filter( f => f.properties.type === "Link").map( f => [f.geometry.coordinates])
    const lineData = geoJson.features.filter( f => f.properties.type === "Link").map( f => f.properties)

    shpWrite.write( lineData , 'POLYLINE', lineGeom, (err:Error, files:any) => {
        const fileName = "links"
        zip.file(fileName + '.shp', files.shp.buffer, { binary: true })
        zip.file(fileName + '.shx', files.shx.buffer, { binary: true })
        zip.file(fileName + '.dbf', files.dbf.buffer, { binary: true })
    })

    const pointGeom = geoJson.features.filter( f => f.properties.type === "Node").map( f => f.geometry.coordinates)
    const pointData = geoJson.features.filter( f => f.properties.type === "Node").map( f => f.properties)

    
    shpWrite.write( pointData, 'POINT', pointGeom, (err:Error, files:any) => {
        const fileName = "node"
        zip.file(fileName + '.shp', files.shp.buffer, { binary: true })
        zip.file(fileName + '.shx', files.shx.buffer, { binary: true })
        zip.file(fileName + '.dbf', files.dbf.buffer, { binary: true })
    })


    zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE'
      }).then(function(content) {
          console.log(content)
          saveAs(content, 'export.zip');
        });

}
