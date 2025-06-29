import axios from "axios";

const urlServerRepository = process.env.REACT_APP_URL_SERVER_REPOSITORY;

export async function SendDataToServer(sendValues) {
    //
    if (!sendValues) return;

    let data = null;
    try {
        const response = await axios.post(urlServerRepository, sendValues);
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
    }
    return data;
}
