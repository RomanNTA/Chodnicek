import axios from "axios";

const urlServerRepository = process.env.REACT_APP_URL_SERVER_REPOSITORY;

export async function DeleteItemsOnServer(uuid) {
    //
    if (uuid == "") return;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    };

    let url = urlServerRepository + "/" + uuid;
    let data = null;
    try {
        const response = await axios.delete(url, headers);
        // console.log("Data odeslána ...");
        // console.log(response.data);
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
    }
    return data;
}
