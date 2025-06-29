//
import ".";
import { registerParser } from "../parserRegistry";

//
// ===============================================
const __getRoutePosition = (rawData) => {
    // =============================================
    if (!rawData) return null;
    var buf = [];
    var oldPos = [];
    var newPos = [];
    var _position = [];

    console.log("__getRoutePosition ... " + rawData?.items[0]);
    try {
        for (let i = 0; i < rawData.items.length; i++) {
            let e = rawData.items[i]?.position;
            newPos = [e.latitude, e.longitude];
            if (i > 0) {
                buf.push([oldPos, newPos]);
            } else {
                _position = newPos;
            }
            oldPos = newPos;
        }
        return { coordinates: buf, position: _position };
    } catch (error) {
        return null;
    }
};

// ===============================================
const __getRouteTowers = (rawData) => {
    // =============================================
    if (!rawData) return null;
    var buf = [];
    var newPos = [];
    // ze zdrojových dat vytáhne seznam "cellTowers" s kterými byl objekt v komunikaci
    try {
        for (let i = 0; i < rawData.items.length; i++) {
            const e = rawData.items[i]?.cellTowers[0];
            newPos = {
                radioType: e.radioType,
                cellId: e.cellId,
            };
            buf.push(newPos);
        }
        return { cellTowers: buf };
    } catch (error) {
        return null;
    }
};

// ===============================================
async function __getTimestamp(rawData) {
    // =============================================
    if (!rawData) return null;

    var buf = [];
    try {
        for (let i = 0; i < rawData.items.length; i++) {
            const e = rawData.items[i]?.timestamp;
            buf.push(e);
        }
        return { timestamp: buf };
    } catch (error) {
        return null;
    }
}

/** -----------------------------------------------------------------------
 * @param {string} json Obsah JSON souboru.
 * @returns {Promise<Map<string, any>>} Mapa extrahovaných dat.
 * --------------------------------------------------------------------- */
async function parse_JSON_MLS_V1(json) {
    //
    let result = new Map();
    json = JSON.parse(json);
    let p = __getRoutePosition(json);
    if (p !== null) {
        result.set("coordinates", p.coordinates);
        result.set("position", p.position);
    } else {
        console.error("coordinates + position");
    }

    let w = __getRouteTowers(json);
    if (w !== null) {
        result.set("cellTowers", w.cellTowers);
    } else {
        console.error("cellTowers");
    }

    let t = await __getTimestamp(json);
    if (t !== null) {
        result.set("timestamp", t.timestamp);
    } else {
        console.error("timestamp");
    }

    // console.log("result");
    // console.log(result);

    // =============================================
    return result;
    // =============================================
}

// Zaregistruj parser do pole !!!!!!!!!!!!!
registerParser("json", "MLS-V1", parse_JSON_MLS_V1);
