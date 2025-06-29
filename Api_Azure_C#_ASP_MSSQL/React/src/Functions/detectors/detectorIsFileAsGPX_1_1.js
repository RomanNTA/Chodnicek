//
//  Detektor na soubory GPX v 1.1
//  Testován na souboru z "Tower Collector 2.16.0"
//
export const detectorIsFileAsGPX_1_1 = (input) => {
    //
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, "text/xml");
    const rootElement = xmlDoc.documentElement;
    //
    return (
        rootElement.tagName === "gpx" &&
        rootElement.getAttribute("version") === "1.1"
    );
    //
};
