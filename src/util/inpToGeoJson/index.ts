import EpanetGeoJSON, {
  NodeFeature,
  LinkFeature,
  Junction,
  Tank,
  Reservior,
  Pipe,
  Valve,
  Pump,
  ValveType,
} from "../../interfaces/EpanetGeoJson";

interface NodeLookup {
  [id: string]: NodeFeature;
}

interface LinkLookup {
  [id: string]: LinkFeature;
}

interface EpanetData {
  nodeIndex: number;
  linkIndex: number;
  currentFunction: string;
  errors: string[];
  nodes: NodeLookup;
  links: LinkLookup;
}

export function toGeoJson(inpFile: string): EpanetGeoJSON {
  const epanetData: EpanetData = {
    currentFunction: "",
    nodeIndex: 0,
    linkIndex: 0,
    errors: [],
    nodes: {},
    links: {},
  };

  const lines = inpFile.split("\n");
  const data = lines.reduce((previousValue, currentValue, currentIndex) => {
    return readLine(previousValue, currentValue, currentIndex);
  }, epanetData);

  const links = (Object.keys(data.links) as Array<keyof LinkLookup>).reduce(
    (acc, l) => {
      const link = data.links[l];
      const { usNodeId, dsNodeId } = link.properties;
      const usGeometry = data.nodes[usNodeId].geometry.coordinates;
      const dsGeometry = data.nodes[dsNodeId].geometry.coordinates;

      link.geometry.coordinates = [
        usGeometry,
        ...link.geometry.coordinates,
        dsGeometry,
      ];

      return acc.concat(link);
    },
    [] as LinkFeature[]
  );

  if (data.linkIndex === 0 && data.nodeIndex === 0) {
    throw "Reading INP Failed, no link or nodes found";
  }
  if (data.errors.length > 0) {
    console.log(data.errors);
  }

  const model: EpanetGeoJSON = {
    type: "FeatureCollection",
    features: [...links, ...Object.values(data.nodes)],
  };

  return model;
}

function readLine(
  epanetData: EpanetData,
  unTrimmedCurrentLine: string,
  lineNumber: number
): EpanetData {
  // Removing comments from string and any extra spacing/tabs
  // From:  "J-1952A	   311.450000	   ; Comment"
  // To:    "J-1952A 311.450000"
  const commentStart = unTrimmedCurrentLine.indexOf(";");
  const trimTo =
    commentStart === -1 ? unTrimmedCurrentLine.length : commentStart;
  const currLine = unTrimmedCurrentLine
    .substring(0, trimTo)
    .replace(/\s+/g, " ")
    .trim();

  // get all text after the comment, remove new line characters
  const comment =
    commentStart === -1
      ? ""
      : unTrimmedCurrentLine
          .substring(commentStart + 1)
          .replace(/(\r\n|\n|\r)/gm, "");

  // if line starts with ; or is blank skip
  if (currLine[0] === ";" || currLine[0] === "" || currLine[0] === undefined) {
    return epanetData;
  }

  // if line starts with [ then new section
  if (currLine[0] === "[" || currLine[currLine.length - 1] === "]") {
    epanetData.currentFunction = currLine;
    return epanetData;
  }

  switch (epanetData.currentFunction) {
    case "[JUNCTIONS]":
      return junctions(epanetData, currLine, lineNumber, comment);
    case "[RESERVOIRS]":
      return reservoirs(epanetData, currLine, lineNumber, comment);
    case "[PIPES]":
      return pipes(epanetData, currLine, lineNumber, comment);
    case "[VALVES]":
      return valves(epanetData, currLine, lineNumber, comment);
    case "[COORDINATES]":
      return coordinates(epanetData, currLine, lineNumber);
    case "[VERTICES]":
      return vertices(epanetData, currLine, lineNumber);
    case "[PUMPS]":
      return pumps(epanetData, currLine, lineNumber, comment);
    case "[TANKS]":
      return tanks(epanetData, currLine, lineNumber, comment);
    default:
      return epanetData;
  }
}

function junctions(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number,
  comment: string
): EpanetData {
  const data = currLine.split(" ");
  if (data.length < 2 || data.length > 4) {
    return {
      ...epanetData,
      errors: epanetData.errors.concat(`Error Reading Line ${lineNumber}`),
    };
  }
  const [id] = data;

  const junction: Junction = {
    type: "Feature",
    id: epanetData.nodeIndex,
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    properties: {
      type: "Node",
      category: "Junction",
      id,
      elevation: parseFloat(data[1]),
      demand: parseFloat(data[2]),
      pattern: data[3],
      comment,
    },
  };

  epanetData.nodes[id] = junction;
  epanetData.nodeIndex++;

  return epanetData;
}

function reservoirs(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number,
  comment: string
): EpanetData {
  const data = currLine.split(" ");
  if (data.length < 2 || data.length > 3) {
    return {
      ...epanetData,
      errors: epanetData.errors.concat(`Error Reading Line ${lineNumber}`),
    };
  }
  const [id] = data;

  const reservior: Reservior = {
    type: "Feature",
    id: epanetData.nodeIndex,
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    properties: {
      type: "Node",
      category: "Reservior",
      id,
      head: parseFloat(data[1]),
      pattern: data[2],
      comment,
    },
  };

  epanetData.nodes[id] = reservior;
  epanetData.nodeIndex++;
  return epanetData;
}

function tanks(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number,
  comment: string
): EpanetData {
  const data = currLine.split(" ");
  if (data.length < 7 || data.length > 9) {
    return {
      ...epanetData,
      errors: epanetData.errors.concat(`Error Reading Line ${lineNumber}`),
    };
  }

  const [id] = data;

  const tank: Tank = {
    type: "Feature",
    id: epanetData.nodeIndex,
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    properties: {
      type: "Node",
      category: "Tank",
      id,
      elevation: parseFloat(data[1]),
      initLevel: parseFloat(data[2]),
      minLevel: parseFloat(data[3]),
      maxLevel: parseFloat(data[4]),
      diameter: parseFloat(data[5]),
      minVolume: parseFloat(data[6]),
      volCurve: data[7],
      overflow: data[8] ? data[8].toLowerCase() === "true" : undefined,
      comment,
    },
  };

  return {
    ...epanetData,
    nodes: {
      ...epanetData.nodes,
      [id]: tank,
    },
    nodeIndex: epanetData.nodeIndex + 1,
  };
}

function pipes(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number,
  comment: string
): EpanetData {
  const data = currLine.split(" ");
  if (data.length < 6 || data.length > 8) {
    return {
      ...epanetData,
      errors: epanetData.errors.concat(`Error Reading Line ${lineNumber}`),
    };
  }

  const [
    id,
    usNodeId,
    dsNodeId,
    length,
    diameter,
    roughness,
    minorLoss,
    statusAsString,
  ] = data;

  let status: "Open" | "Closed" | "CV" | undefined = undefined;

  switch (statusAsString && statusAsString.toLowerCase()) {
    case "open":
      status = "Open";
      break;

    case "closed":
      status = "Closed";
      break;

    case "cv":
      status = "CV";
      break;

    default:
      break;
  }

  const pipe: Pipe = {
    type: "Feature",
    id: epanetData.linkIndex,
    geometry: {
      type: "LineString",
      coordinates: [],
    },
    properties: {
      type: "Link",
      category: "Pipe",
      id,
      usNodeId,
      dsNodeId,
      length: parseFloat(length),
      diameter: parseFloat(diameter),
      roughness: parseFloat(roughness),
      minorLoss: parseFloat(minorLoss),
      status,
      comment,
    },
  };

  epanetData.links[id] = pipe;
  epanetData.linkIndex++;

  return epanetData;
}

interface PumpKeyValues {
  [x: string | number | symbol]: unknown;
  head: string | undefined;
  power: number | undefined;
  speed: number | undefined;
  pattern: string | undefined;
}

function pumps(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number,
  comment: string
): EpanetData {
  const data = currLine.split(" ");
  if (
    data.length < 5 ||
    data.length === 6 ||
    data.length === 8 ||
    data.length === 10 ||
    data.length > 11
  ) {
    return {
      ...epanetData,
      errors: epanetData.errors.concat(`Error Reading Line ${lineNumber}`),
    };
  }

  //Pump2   N121    N55     HEAD Curve1  SPEED 1.2  PATTERN 1 POWER 2.0

  const [
    id,
    usNodeId,
    dsNodeId,
    key1,
    value1,
    key2,
    value2,
    key3,
    value3,
    key4,
    value4,
  ] = data;

  let head = undefined;
  let power = undefined;
  let speed = undefined;
  let pattern = undefined;

  const addKey = (key: string, value: string, obj: PumpKeyValues) => {
    if (key) {
      console.log(key, value);
      obj[key.toLocaleLowerCase()] = value ? value : undefined;
    }
  };

  try {
    const keyValues: PumpKeyValues = {
      head: undefined,
      power: undefined,
      speed: undefined,
      pattern: undefined,
    };

    addKey(key1, value1, keyValues);
    addKey(key2, value2, keyValues);
    addKey(key3, value3, keyValues);
    addKey(key4, value4, keyValues);

    console.log(keyValues);

    head = keyValues["head"] ? keyValues["head"] : undefined;
    power = keyValues["power"] ? keyValues["power"] : undefined;
    speed = keyValues["speed"] ? keyValues["speed"] : undefined;
    pattern = keyValues["pattern"] ? keyValues["pattern"] : undefined;
  } catch (error) {
    console.log(error);
    throw error;
  }

  const pump: Pump = {
    type: "Feature",
    id: epanetData.linkIndex,
    geometry: {
      type: "LineString",
      coordinates: [],
    },
    properties: {
      type: "Link",
      category: "Pump",
      id,
      usNodeId,
      dsNodeId,
      head,
      power,
      speed,
      pattern,
      comment,
    },
  };
  console.log(pump);

  return {
    ...epanetData,
    links: {
      ...epanetData.links,
      [id]: pump,
    },
    linkIndex: epanetData.linkIndex + 1,
  };
}

function valves(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number,
  comment: string
): EpanetData {
  const data = currLine.split(" ");

  const [id, usNodeId, dsNodeId, diameter, valveType, setting, minorLoss] =
    data;

  const valve: Valve = {
    type: "Feature",
    id: epanetData.linkIndex,
    geometry: {
      type: "LineString",
      coordinates: [],
    },
    properties: {
      type: "Link",
      category: "Valve",
      id,
      usNodeId,
      dsNodeId,
      diameter: parseFloat(diameter),
      valveType: valveType as ValveType,
      setting: parseFloat(setting),
      minorLoss: parseFloat(minorLoss),
      comment,
    },
  };

  epanetData.links[id] = valve;
  epanetData.linkIndex++;

  return epanetData;
}

function coordinates(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number
): EpanetData {
  const data = currLine.split(" ");
  if (epanetData.nodes[data[0]] === undefined) {
    return {
      ...epanetData,
      errors: epanetData.errors.concat(`Error Reading Line ${lineNumber}`),
    };
  }

  const node = epanetData.nodes[data[0]];
  const x = parseFloat(data[1]);
  const y = parseFloat(data[2]);

  epanetData.nodes[data[0]] = {
    ...node,
    geometry: {
      ...node.geometry,
      coordinates: [x, y],
    },
  };

  return epanetData;
}

function vertices(
  epanetData: EpanetData,
  currLine: string,
  lineNumber: number
): EpanetData {
  const data = currLine.split(" ");

  const link = epanetData.links[data[0]];

  const existingBends = link.geometry.coordinates;
  const newBend = [parseFloat(data[1]), parseFloat(data[2])];

  const bends = existingBends ? existingBends.concat([newBend]) : [newBend];

  epanetData.links[data[0]] = {
    ...link,
    geometry: {
      ...link.geometry,
      coordinates: bends,
    },
  };

  return epanetData;
}
