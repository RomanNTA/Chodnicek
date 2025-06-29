//**
//
//   IndexDB
//
//  */
const DB_NAME = "NoBodyFileStorageDB";
const DB_VERSION = 1;
const STORE_NAME = "files";

let db;

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
            reject("Error opening IndexedDB:", event.target.error);
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
        }); // Uložíme obsah (text/ArrayBuffer) a metadata

        request.onsuccess = () => resolve();
        request.onerror = (event) =>
            reject("Error saving file:", event.target.error);
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
            reject("Error getting file:", event.target.error);
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
 * @param {string} fileId - ID souboru, který se má aktualizovat.
 * @param {object} updates - Objekt obsahující vlastnosti, které se mají aktualizovat (např. { content: 'novy obsah', metadata: { ... } }).
 * @returns {Promise<void>} Promise, který se vyřeší po úspěšné aktualizaci, nebo se zamítne při chybě.
 */
export async function updateFileInIndexedDb(fileId, updates) {
    //
    if (!db) {
        await openDb(); // Zajistíme, že databáze je otevřená
    }

    return new Promise((resolve, reject) => {
        // Otevřeme transakci pro zápis
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(fileId);
        getRequest.onsuccess = (event) => {
            const existingRecord = event.target.result;

            if (existingRecord) {
                const updatedRecord = {
                    ...existingRecord, // Ponecháme existující vlastnosti
                    ...updates, // Přepíšeme je novými hodnotami z 'updates'
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
                    `Record with ID ${fileId} not found for update. Creating new record.`
                );
                const newRecord = { uuid: fileId, ...updates };
                const putRequest = store.put(newRecord);

                putRequest.onsuccess = () => resolve();
                putRequest.onerror = (putEvent) =>
                    reject(
                        "Error creating new file during update in IndexedDB:",
                        putEvent.target.error
                    );
            }
        };

        getRequest.onerror = (event) => {
            reject("Error retrieving record for update:", event.target.error);
        };
    });
}
