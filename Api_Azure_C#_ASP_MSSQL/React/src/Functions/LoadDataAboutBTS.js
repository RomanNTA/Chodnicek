import axios from "axios";

const urlServerBTSInfo = process.env.REACT_APP_URL_SERVER_BTS;

export async function LoadDataAboutBTS(setOfBTS) {
    //
    if (!setOfBTS) return;
    // Distinct cellId
    let setCellId = new Set(setOfBTS.map((item) => item["cellId"]));
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    };
    const sendValues = {
        Cellid: Array.from(setCellId).join(","),
    };
    let data = null;
    try {
        const response = await axios.post(
            urlServerBTSInfo,
            sendValues,
            headers
        );
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
        return null;
    }
    return data;
}
