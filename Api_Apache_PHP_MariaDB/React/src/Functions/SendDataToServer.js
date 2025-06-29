import axios from "axios";

//const urlServerRepository = "http://pc-nta:8071/repository/ServerService.php";
const urlServerRepository = process.env.REACT_APP_URL_SERVER_REPOSITORY;

export async function SendDataToServer(sendValues) {
    //
    if (!sendValues) return;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    };

    let data = null;
    try {
        const response = await axios.post(
            urlServerRepository,
            sendValues,
            headers
        );
        // console.log("Data odeslána ...");
        // console.log(response.data);
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
    }
    return data;
}
