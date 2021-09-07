import { expose } from "comlink";
import runToGeoJson from "./runToGeoJson";

export type RunToGeoJsonWorkerType = typeof runToGeoJson;

expose(runToGeoJson);