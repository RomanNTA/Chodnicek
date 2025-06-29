import React, { useState, useEffect, useContext } from "react";

// Pro generování unikátního ID pro každý soubor
// import { v4 as uuidv4 } from "uuid";

// React Bootstrap + React-icons
import { Row, Col, Button, Toast } from "react-bootstrap";
import { BsDisplay, BsDatabaseCheck } from "react-icons/bs";
import { FaServer, FaUpload } from "react-icons/fa";

// IndexDB
import {
    getFileFromIndexedDb,
    getAllFileMetadataFromIndexedDb,
    deleteFileFromIndexedDb,
} from "../../Functions/NoNameDB.js";

//
//import { detectFileTypeAndModification } from "../../Functions/fileTypeDetector";
import { SendDataToServer } from "../../Functions/SendDataToServer";
import { DeleteItemsOnServer } from "../../Functions/DeleteItemsOnServer";
import "../../Functions/parsers/index.js"; // Zajištění registrace parserů

import { DataContext, ModalContext } from "../../GlobalContext";

import { GetNET_All, GetNET_JSON } from "../../Functions/GetDataFromServer.js";

// -----------------------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------------------
function FileProcessor() {
    //
    //  GLOBÁLNÍ DATA KONTEXT !!!!!!!!!!!!!!!!!
    const D = useContext(DataContext);
    const MC = useContext(ModalContext);
    //  GLOBÁLNÍ DATA KONTEXT !!!!!!!!!!!!!!!!!

    const [loading, setLoading] = useState(MC.page == 1);

    /**
     *     Načtení všech metadat ze serveru a vložení do seznamu
     */
    const loadInitialFilesFromServer = async () => {
        try {
            let fromServer = await GetNET_All();
            if (!fromServer) return;
            D.setUploadedFiles((prevMap) => {
                const newMap = new Map(prevMap);
                fromServer.forEach((x) =>
                    newMap.set(x.uuid, { ...x, src: "NETSRC-DB" })
                );
                return newMap;
            });
        } catch (error) {
            console.log("Chyba při nahrávání dat ze servru.");
            console.error(error);
        }
    };

    /**
     *  Vymazání lokální databáze ... v aplikaci nepoužité ... jen pro vyčištění při DEBUGu !!!
     */

    // const TmpVymazDB = async () => {
    //     console.log(
    //         "fileData -------------------------- getAllFileMetadataFromIndexedDb"
    //     );
    //     const fileIds = await getAllFileMetadataFromIndexedDb(); // Získáme ID-čka pro uložené soubory
    //     console.log(fileIds);

    //     for (let x of fileIds) {
    //         const res = await deleteFileFromIndexedDb(x);
    //         console.log("Výmaz ... " + x);
    //         console.log(res);
    //     }
    //     console.log("fileData -------------------------- Kontrola");
    //     const w = await getAllFileMetadataFromIndexedDb(); // Získáme ID-čka pro uložené soubory
    //     console.log(w);
    //     console.log(
    //         "fileData -------------------------- getAllFileMetadataFromIndexedDb"
    //     );
    // };

    /**
     *     Načtení všech metadat z lokální databáze
     */
    const loadInitialFiles = async () => {
        try {
            console.log("fileData --> getAllFileMetadataFromIndexedDb");
            const fileIds = await getAllFileMetadataFromIndexedDb(); // Získáme ID-čka pro uložené soubory

            let tmpFiles = new Map();
            for (const fileId of fileIds) {
                const fileData = await getFileFromIndexedDb(fileId);
                const restoredMap = { ...fileData.metadata, src: "LOCAL-DB" };
                tmpFiles.set(restoredMap.uuid, restoredMap);
            }

            D.setUploadedFiles((prevMap) => {
                const newMap = new Map(prevMap);
                tmpFiles.forEach((x) => newMap.set(x.uuid, x));
                return newMap;
            });
            //
        } catch (error) {
            console.error(
                "Chyba při načítání dat z databáze IndexedDB:",
                error
            );
        }
    };

    const LoadSource = async () => {
        try {
            setLoading(false);

            // Opatrně ... jen pro DEBUG !!!!!!!!!!!!
            // await TmpVymazDB();
            // Opatrně !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            D.setUploadedFiles(new Map());
            await loadInitialFiles();
            await loadInitialFilesFromServer();
        } finally {
            await setLoading(true);
        }
    };

    /**
     *  Načtení uložených souborů z IndexedDB při startu aplikace
     */
    useEffect(() => {
        if (MC.page == 1) {
            LoadSource();
        }
    }, [MC.page]);

    /**
     *
     */
    const handleSelectFileFromList = async (fileId, src) => {
        try {
            // ze zdroje ... databáze nebo servru dostaneš stejný obsah.
            // Vytáhni z toho content, vytvoř objekt Map a vlož to do mapy k zobrazení.
            let fileData;
            switch (src) {
                //
                case "LOCAL-DB": {
                    fileData = await getFileFromIndexedDb(fileId);
                    // console.log("handleSelectFileFromList - fileData");
                    // console.log(fileData);
                    break;
                }
                //
                case "NETSRC-DB": {
                    fileData = await GetNET_JSON(fileId);
                    fileData = JSON.parse(fileData.json);
                    // console.log("handleSelectFileFromList - NET result");
                    // console.log(fileData);
                    break;
                }
                default:
                    console.log(
                        "handleSelectFileFromList --> volání se špatným typem."
                    );
                    return;
            }

            D.setData(new Map(fileData?.content));
            MC.setShow(false);
        } catch (error) {
            console.error("Error loading file from DB:", error);
        }
    };

    /**
     * @param {*} uuid  - klíč mapy
     * @param {*} src   - typ zdroje (půjdeme do lokálu nebo na síť)
     * @returns
     */
    const handleDeleteFileFromList = async (uuid, src) => {
        //
        try {
            // console.log("DELETE SOURCE");
            // console.log(`${uuid}  ---  ${src}`);

            // Vyber, odkud je zdroj. databáze nebo server. Vymaž a pak aktualizuj seznam souboru.
            // Vytvoř novou Map() a nastav.
            switch (src) {
                //
                case "LOCAL-DB": {
                    const res = await deleteFileFromIndexedDb(uuid);
                    break;
                }
                //
                case "NETSRC-DB": {
                    let result = await DeleteItemsOnServer(uuid);
                    break;
                }
                default:
                    console.log(
                        "handleDeleteFileFromList --> volání se špatným typem."
                    );
                    return;
            }
        } catch (error) {
            console.error("Chyba při výmazu položky z DB:", error);
        }
        await D.setEventReloadData(!D.eventReloadData);

        D.uploadedFiles.delete(uuid);
        let tmp = new Map(D.uploadedFiles);
        D.setUploadedFiles(tmp);
    };

    /**
     * metoda handleSendToServer
     */
    const handleSendToServer = async (uuid) => {
        //
        const data = await getFileFromIndexedDb(uuid);
        const sendValues = {
            //Id: 0,
            Uuid: data.uuid,
            ContextName: data.metadata.contextName,
            Comments: data.metadata.comments,
            FileName: data.metadata.fileName,
            Json: JSON.stringify(data), // .content
            TypeSrc: data.metadata.typeSrc,
        };

        let result = await SendDataToServer(sendValues);
        if (result) {
            await deleteFileFromIndexedDb(uuid);
            await D.setEventReloadData(!D.eventReloadData);

            // V lokální DB již není, ale zůstal u uploadFiles a tam se jen změní ikona podle typu STC
            let tmpFiles = new Map();
            D.uploadedFiles.forEach((x) =>
                tmpFiles.set(
                    x.uuid,
                    x.uuid == uuid ? { ...x, src: "NETSRC-DB" } : x
                )
            );
            D.setUploadedFiles(tmpFiles);
        }
    };

    /**
     *
     *   Zobrazení zdrojů.
     *
     */
    const Display = () => {
        //
        if (!loading) return null;

        if (!D.uploadedFiles) return null;
        if (!D.uploadedFiles instanceof Map) return null;
        if (D.uploadedFiles.size == 0) return null;

        const filesArray = Array.from(D.uploadedFiles.values());
        return (
            <>
                {filesArray.map((file) => [
                    <Toast
                        key={file.uuid}
                        className='m-1'
                        onClose={() =>
                            handleDeleteFileFromList(file.uuid, file.src)
                        }>
                        <Toast.Header>
                            {file.src === "LOCAL-DB" && (
                                <BsDatabaseCheck className='fs-4 text-danger me-2' />
                            )}
                            {file.src === "NETSRC-DB" && (
                                <FaServer className='fs-4 text-primary me-2' />
                            )}
                            <strong className='me-auto'>
                                {file.contextName}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className='d-flex'>
                            <Col xs={10}>
                                Poznámka: {file.comments}
                                <br />
                                Soubor: {file.fileName}
                                <br />
                            </Col>
                            <Col xs={2} className=''>
                                {/* /----------------UPLOAD FILE TO SERVER-------------------------/ */}
                                {file.src === "LOCAL-DB" && (
                                    <Button
                                        className='btn btn-outline-dark bg-transparent shadow m-1'
                                        value={file.comments}
                                        onClick={() =>
                                            handleSendToServer(file.uuid)
                                        }>
                                        <FaUpload className='fs-4 text-success  mx-auto my-auto' />
                                    </Button>
                                )}
                                {/* /-----------------------SHOW FILE------------------------------/ */}
                                <Button
                                    className='btn btn-outline-success bg-transparent shadow  m-1'
                                    value={file.uuid}
                                    onClick={() =>
                                        handleSelectFileFromList(
                                            file.uuid,
                                            file.src
                                        )
                                    }>
                                    <BsDisplay className='fs-4 text-success  mx-auto my-auto' />
                                </Button>
                            </Col>
                        </Toast.Body>
                    </Toast>,
                ])}
            </>
        );
    };

    return (
        <div>
            {/* /---------------------------------------------------/ */}
            <Row className='d-flex justify-content-around'>
                {!loading ? "Načítání zdrojů." : <Display />}
            </Row>
            {/* /---------------------------------------------------/ */}
        </div>
    );
}

export default FileProcessor;
