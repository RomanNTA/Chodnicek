/**
 *
 *    IndexDB
 *
 */
const DB_NAME = "NoBodyFileStorageDB";
const DB_VERSION = 1;
const STORE_NAME = "files";
//
let db;
//
function openDb() {
    //
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                /**
                 * POZOR !!! Odkomentuj jen když potřebuješ smazat databázi a vytvořit novou !!!!!!!!!!
                 */
                //  db.deleteObjectStore(STORE_NAME);
                /**
                 * POZOR !!! !!!!!!!!!!
                 */
                const objectStore = db.createObjectStore(STORE_NAME, {
                    keyPath: "uuid",
                    autoIncrement: false,
                });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject("Chyba ... nejde otevřít IndexedDB:", event.target.error);
        };
    });
}

export async function saveFileToIndexedDb(uuid, fileContent, fileMetadata) {
    if (!db) await openDb();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({
            uuid: uuid,
            content: fileContent,
            metadata: fileMetadata,
        });
        request.onsuccess = () => resolve();
        request.onerror = (event) =>
            reject("Chyba při ukládání souboru", event.target.error);
    });
}

export async function getFileFromIndexedDb(fileId) {
    if (!db) await openDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(fileId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) =>
            reject("Chyba při načítání souboru.", event.target.error);
    });
}

export async function getAllFileMetadataFromIndexedDb() {
    if (!db) await openDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        // Získáme jen klíče (UUID), abychom nemuseli stahovat celý obsah souborů hned
        const request = store.getAllKeys();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) =>
            reject("Error getting all keys:", event.target.error);
    });
}

export async function deleteFileFromIndexedDb(fileId) {
    if (!db) await openDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(fileId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) =>
            reject("Error getting file:", event.target.error);
    });
}

/**
 * Aktualizuje existující záznam v IndexedDB.
 * Pokud záznam s daným fileId neexistuje, vytvoří ho (chování put).
 * @param {string} fileId - ID souboru
 * @param {object} updates - Objekt obsahující vlastnosti
 * @returns {Promise<void>}
 */
export async function updateFileInIndexedDb(fileId, updates) {
    //
    if (!db) {
        await openDb();
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(fileId);
        getRequest.onsuccess = (event) => {
            const existingRecord = event.target.result;
            if (existingRecord) {
                const updatedRecord = {
                    ...existingRecord, // existující vlastnosti zůstanou
                    ...updates, // ... a přepíšou se novými hodnotami z 'updates' !!! (né, naopak !)
                };
                updatedRecord.id = fileId;
                const putRequest = store.put(updatedRecord);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = (putEvent) =>
                    reject(
                        "Error updating file in IndexedDB:",
                        putEvent.target.error
                    );
            } else {
                console.warn(
                    `Záznam uuid ${fileId} nebyl nalezen a bude vložen do DB.`
                );
                const newRecord = { uuid: fileId, ...updates };
                const putRequest = store.put(newRecord);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = (putEvent) =>
                    reject(
                        "Chyba při vložení nového záznamu do IndexedDB.",
                        putEvent.target.error
                    );
            }
        };

        getRequest.onerror = (event) => {
            reject("Obecná chyba při aktualizaci.", event.target.error);
        };
    });
}
