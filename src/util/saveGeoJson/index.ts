import EpanetGeoJSON from '../../interfaces/EpanetGeoJson';
import { saveAs } from 'file-saver';

export function saveGeoJson(geoJson: EpanetGeoJSON, filename:string) {

    const blob = new Blob([JSON.stringify(geoJson)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${filename}.json`);

}