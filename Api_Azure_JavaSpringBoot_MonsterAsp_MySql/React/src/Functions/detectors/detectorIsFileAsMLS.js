//
//  Detektor na soubory MLS Geosubmit v.2
//  Testován na souboru z "Network Cell Info Lite"
//
export const detectorIsFileAsMLS = (input) => {
    //
    let mls = undefined;
    let p = undefined;
    try {
        p = JSON.parse(input);
        mls = p?.items[0];
    } catch (error) {
        return null;
    }

    // Pokud je to mls ... true - false
    return mls !== null || mls !== undefined;
};
