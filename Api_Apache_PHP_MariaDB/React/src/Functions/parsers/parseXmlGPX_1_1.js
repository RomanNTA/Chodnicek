import { registerParser } from "../parserRegistry";

/**
 * Parser pro XML inventární soubory verze 2.
 * @param {string} content Obsah XML souboru.
 * @returns {Promise<Map<string, any>>} Mapa extrahovaných dat.
 */

async function parseXmlGPX_1_1(content) {
    // console.log("parseXmlGPX_1_1 ... vstup");

    // ----------------  TIMESTAMP ---------------------------------------------------
    let timestam = [];
    const timestamAdd = (timeString) => {
        timestam.push(+new Date(timeString));
    };

    // ----------------  COORDINATES -------------------------------------------------
    let coordinates = [];
    let coordinatesOld = null;
    let segment = 0;

    const coordinatesAdd = (child, pruchod, first) => {
        //
        let lat = child?.getAttribute("lat");
        let lon = child?.getAttribute("lon");
        let coordinatesNew = child ? [lat, lon] : null;
        // Souřadnice se zapisují do pole [od - do]
        // První se zapamatuje a čeká na druhý průchod
        if (first) {
            if (coordinatesOld) {
                coordinates.push([coordinatesOld, coordinatesOld]);
            }
            coordinatesOld = coordinatesNew;
            return;
        } else {
            coordinates.push([coordinatesOld, coordinatesNew]);
            coordinatesOld = coordinatesNew;
        }
    };

    // ----------------  CELL TOWERS ------------------------------------------------

    let cellTowers = [];
    const parseBtsCdata = (text) => {
        var result = {};
        let str = text
            .replace("(", "")
            .replace(")", "")
            .replace("(", "")
            .replace(")", "");
        str.split(", ").forEach((pair) => {
            // rozdělím
            let p = pair.split(" ");
            let key = p.shift();
            let value = p.join(" ");
            if (key === "CID") {
                key = "cellId";
                value = parseInt(value);
            }
            result = { ...result, [key]: value };
        });
        cellTowers = [...cellTowers, result];
    };

    // ----------------  HEAD CYCLE -------------------------------------------------
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error("Invalid XML content.");
    }

    const result = new Map();

    let gpx = xmlDoc.querySelectorAll("gpx");
    if (gpx) {
        let trkseg = xmlDoc.querySelectorAll("trkseg");

        let pruchod = 0;
        Array.from(trkseg).forEach((child, index) => {
            let first = true;
            Array.from(child.querySelectorAll("trkpt")).forEach((child) => {
                timestamAdd(child.querySelector("time").textContent);
                coordinatesAdd(child, pruchod++, first);
                first = false;
                parseBtsCdata(child.querySelector("name").textContent);
            });
        });
        // Na konci se musí uzavřít cyklu ...
        coordinatesAdd(null, pruchod++, true);
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // console.log("timestam");
        // console.log(timestam);
        // console.log("coordinates");
        // console.log(coordinates);
        // console.log("cellTowers");
        // console.log(cellTowers);

        result.set("coordinates", coordinates);
        result.set("cellTowers", cellTowers);
        result.set("timestamp", timestam);
        result.set("position", coordinates[0][0]);
    }
    return result;
}

// Registruj parser při importu modulu
registerParser("xml", "GPX-v1.1", parseXmlGPX_1_1);
