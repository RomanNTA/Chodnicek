import React, { useEffect } from "react";

function LoaderURL(pathURI, callContextHandler) {
    async function loadFile() {
        try {
            const response = await fetch(pathURI);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            callContextHandler(text);
        } catch (e) {
            //
        }
    }

    useEffect(() => {
        loadFile();
    }, []);

    return;
}

export default LoaderURL;
