import axios from "axios";

const urlServerRepository = process.env.REACT_APP_URL_SERVER_REPOSITORY;

/** ------------------------------------------------------------------------------------------
 * @returns Data přes GET ze servru - hlavička HEADERS posílá seznam položek v DB na servru
 */
export async function GetNET_All() {
    let sendValues = [];
    let url = `${urlServerRepository}/headers`;
    return await GetDataFromServer(sendValues, url);
}

/** ------------------------------------------------------------------------------------------
 * @param {*} uuid ... pro předaný uuid
 * @returns vrátí metadata přes GET pro žádanou položku
 */
export async function GetNET_INFO(uuid) {
    let sendValues = [];
    let url = `${urlServerRepository}/detail/${uuid}`;
    return await GetDataFromServer(sendValues, url);
}

/** ------------------------------------------------------------------------------------------
 * @param {*} uuid ... pro předaný uuid
 * @returns vrátí JSON přes GET pro žádanou položku
 */
export async function GetNET_JSON(uuid) {
    let sendValues = [];
    let url = `${urlServerRepository}/json/${uuid}`;
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
    if (!sendValues) return;
    // pokud nezadáš hlavičku, tak ji axios doplni
    // const headers = {
    //     Accept: "application/json",
    //     "Content-Type": "application/json;charset=UTF-8",
    // };
    let data = null;
    try {
        //const response = await axios.get(url, sendValues, headers);
        const response = await axios.get(url, sendValues);
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
    }
    return data;
}
