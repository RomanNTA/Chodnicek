import axios from "axios";
const urlServerRepository = process.env.REACT_APP_URL_SERVER_REPOSITORY;

/** ------------------------------------------------------------------------------------------
 * @returns Data přes GET ze servru - hlavička HEADERS posílá seznam položek v DB na servru
 */
export async function GetNET_All() {
    let sendValues = [];
    let url = `${urlServerRepository}?task=headers`;
    //console.log(`GetNET_All : ${url}`);
    return await GetDataFromServer(sendValues, url);
}

/** ------------------------------------------------------------------------------------------
 * @param {*} uuid ... pro předaný uuid
 * @returns vrátí metadata přes GET pro žádanou položku
 */
export async function GetNET_INFO(uuid) {
    let sendValues = [];
    let url = `${urlServerRepository}?task=info-id&uuid=${uuid}`;
    //console.log(`GetNET_INFO : ${url}`);
    return await GetDataFromServer(sendValues, url);
}

/** ------------------------------------------------------------------------------------------
 * @param {*} uuid ... pro předaný uuid
 * @returns vrátí JSON přes GET pro žádanou položku
 */
export async function GetNET_JSON(uuid) {
    let sendValues = [];
    let url = `${urlServerRepository}?task=json-id&uuid=${uuid}`;
    //console.log(`GetNET_JSON : ${url}`);
    return await GetDataFromServer(sendValues, url);
}

/** ------------------------------------------------------------------------------------------
 *
 * @param {*} sendValues
 * @param {*} url
 * @returns
 */
export async function GetDataFromServer(sendValues, url) {
    //
    console.log("GetDataFromServer: " + sendValues);
    if (!sendValues) return;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    };
    let data = null;
    try {
        const response = await axios.get(url, sendValues, headers);
        // console.log("Data odeslána ...");
        // console.log(url);
        // console.log(sendValues);
        // console.log(response.data);
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
    }
    return data;
}
