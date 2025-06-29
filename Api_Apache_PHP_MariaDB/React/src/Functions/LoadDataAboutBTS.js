import React, { useState, useEffect } from "react";
import axios from "axios";

const urlServerBTSInfo = process.env.REACT_APP_URL_SERVER_BTS;

export async function LoadDataAboutBTS(setOfBTS) {
    //
    if (!setOfBTS) return;
    let setCellId = new Set(setOfBTS.map((item) => item["cellId"]));

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    };

    const sendValues = {
        task: "GET_INFO_BTS",
        cellId: Array.from(setCellId).join(","),
    };

    let data = null;
    try {
        const response = await axios.post(
            urlServerBTSInfo,
            sendValues,
            headers
        );
        // console.log("Data úspěšně přijata:");
        // console.log(response.data);
        data = response.data;
    } catch (error) {
        console.error("Chyba při odesílání/přijímání dat:", error);
        return null;
    }

    return data;
}
