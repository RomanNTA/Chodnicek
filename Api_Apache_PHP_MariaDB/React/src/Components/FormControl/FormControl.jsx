import React, { useEffect } from "react";
import "./FormControl.css";
import { useState, useContext } from "react";
import { Row, Col, Button, Tab, Tabs, Form } from "react-bootstrap";

// Pro generování unikátního ID pro každý soubor
import { v4 as uuidv4 } from "uuid";

import { detectFileTypeAndModification } from "../../Functions/fileTypeDetector";
import { parseFileContent } from "../../Functions/parserRegistry";
import { LoadDataAboutBTS } from "../../Functions/LoadDataAboutBTS";
import { ModalContext, DataContext } from "../../GlobalContext";

import { saveFileToIndexedDb } from "../../Functions/NoNameDB.js";

const testFile =
    "https://projects.sliva-roman.cz/project6/testsrc/source.php?fileid=";

// --------------------------------------------------------------------------------------
//   KOMPONENTA FormControl
// --------------------------------------------------------------------------------------
function FormControl() {
    //  GLOBÁLNÍ DATA KONTEXT !!!!!!!!!!!!!!!!!
    const D = useContext(DataContext);
    const MC = useContext(ModalContext);
    //  GLOBÁLNÍ DATA KONTEXT !!!!!!!!!!!!!!!!!

    /**
     * všechny formulářové prvky pod "values"
     */
    const [values, setValues] = useState(MC.EmptyFormControl);
    const isValid = (tmp) => {
        //
        return tmp.fileName?.trim() !== "" && tmp.rawData?.trim() !== "";
        //
    };
    const [loading, setLoading] = useState(false);
    const [inpUri, setInpUri] = useState();
    /**
     * metoda handleUriInput;
     */
    const handleUriInput = (e) => {
        setInpUri(e.target.value);
    };
    /**
     * metoda handleChange pro formulářové prvky
     */
    const handleChange = (e) => {
        //
        const [val, name, id] = [e.target.value, e.target.name, e.target.id];
        let tmp = { ...values, [name]: val };
        tmp.isValid = isValid(tmp);
        setValues(tmp);
    };

    // stažení souboru podle URL
    async function fetchFileAsText(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP chyba! Status: ${response.status}`);
        }
        return await response.text();
    }

    // -----------------------------------------------------------------------------------------
    //  ProcessFileContent ... indikování, parsování a uložení do DB
    // -----------------------------------------------------------------------------------------
    const ProcessFileContent = async (fileContent, inputFileName, typeSrc) => {
        try {
            // Ihned naparsujeme a zobrazíme data
            const detection = detectFileTypeAndModification(
                fileContent,
                inputFileName
            );
            if (detection) {
                const parsedMap = await parseFileContent(
                    fileContent,
                    detection.type,
                    detection.modification
                );

                let bts = await LoadDataAboutBTS(
                    (Object?.fromEntries(parsedMap)).cellTowers
                );
                parsedMap.set("uuid", uuidv4());
                parsedMap.set("contextName", values.contextName || "-");
                parsedMap.set("fileName", inputFileName || "-");
                parsedMap.set("comments", values.comments || "-");
                parsedMap.set("btsInfo", bts);
                parsedMap.set("src", "LOCAL-DB");
                parsedMap.set("typeSrc", typeSrc);

                let metaData = {
                    uuid: parsedMap.get("uuid"),
                    contextName: parsedMap.get("contextName"),
                    comments: parsedMap.get("comments"),
                    fileName: parsedMap.get("fileName"),
                    typeSrc: parsedMap.get("typeSrc"),
                    src: parsedMap.get("src"),
                };
                await saveFileToIndexedDb(
                    parsedMap.get("uuid"),
                    Array.from(parsedMap.entries()),
                    metaData
                );
                MC.setAlertMessage(
                    `Soubor ${inputFileName} uložen do databáze.`
                );
                MC.setAlertType("success");
                MC.setAlertShow(true);
                setValues(MC.EmptyFormControl);
            } else {
                MC.setAlertType("danger");
                MC.setAlertShow(true);
                MC.setAlertMessage("Chyba: Nelze detekovat tento nový soubor");
                console.warn("Chyba: Nelze detekovat tento nový soubor");
            }
        } catch (error) {
            //
            MC.setAlertType("danger");
            MC.setAlertShow(true);
            MC.setAlertMessage("Chyba: Chyba při načítání a uložení souboru");
            //
            console.log("Chyba: Chyba při načítání a uložení souboru");
            console.error(error);
        }
    };

    // -----------------------------------------------------------------------------------------
    //
    // -----------------------------------------------------------------------------------------
    const handleForFile = async (e) => {
        //  přes (e) dostaneš
        //    - e.target?.files[0]
        setLoading(true);
        const [val, name, handleFile] = [
            e.target.value,
            e.target.name,
            e.target.files[0],
        ];
        let fileContent;
        if (!handleFile) return;
        try {
            // Přečtení obsahu souboru jako text (pro JSON/XML)
            fileContent = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsText(handleFile);
            });
        } catch (error) {
            console.error(error);
        }
        ProcessFileContent(fileContent, handleFile.name, "TEXT-FILE");
        setLoading(false);
    };

    // -----------------------------------------------------------------------------------------
    //
    // -----------------------------------------------------------------------------------------
    const handleForURL = async (url) => {
        setLoading(true);
        let fileContent;
        // Klik na Button, ale bereme z inputu adresu
        // inpUri ......  obsahuje URL adrersu
        let nameSrc = url.split("/").pop();
        try {
            fileContent = await fetchFileAsText(url);
        } catch (error) {
            console.error(error);
        }
        ProcessFileContent(fileContent, nameSrc, "TEXT-URL");
        // -------------------------------------------------------------------------------------
        setLoading(false);
    };

    /**
     *  Při aktivaci "TAB 2" vymaž všechna editační pole a čeká se na vstup usera
     */
    useEffect(() => {
        if (MC.page == 2) {
            setValues(MC.EmptyFormControl);
            setInpUri("");
        }
    }, [MC.page]);

    return (
        <>
            <Form sm={12} className=''>
                {/* Nahrání souboru */}

                {/* contextName */}
                <Row className='d-flex justify-content-between p-0 m-0'>
                    <Col sm={12} className=' m-0 p-0'>
                        <Form.Group className='my-2 ' controlId='contextName'>
                            <Form.Label className='fs-6 text-primary'>
                                Volitelný název
                            </Form.Label>
                            <Form.Control
                                className='rounded-0'
                                type='text'
                                size='sm'
                                value={values.contextName}
                                name='contextName'
                                placeholder='Zadej název ...'
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} className='m-0 p-0'>
                        {/* TEXT AREA - comments */}
                        <Form.Group className=' m-0 p-0' controlId='comments'>
                            <Form.Label className='fs-6 text-primary' size='sm'>
                                Volitelný krátký komentář.
                            </Form.Label>
                            <Form.Control
                                className='rounded-0'
                                size='sm'
                                as='textarea'
                                rows={5}
                                name='comments'
                                placeholder='Popis ...'
                                value={values.comments}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <Tabs
                    defaultActiveKey='loadTab1'
                    id='TabsHandlerForFile'
                    className='mb-2 rounded-0 tabs'>
                    {/* ---------------------------------------------------------------------- */}
                    <Tab
                        eventKey='loadTab1'
                        title='ze souboru'
                        className='rounded-0'>
                        <Form.Group
                            className='my-2 p-2'
                            controlId='inputFromFile1'>
                            <Form.Label className='fs-6 text-primary'>
                                Jméno souboru
                            </Form.Label>
                            <Form.Control
                                className='form-control'
                                disabled={loading}
                                type='file'
                                value={values.fileName}
                                size='sm'
                                name='inputFromFile'
                                placeholder='Vyber zdrojový soubor ...'
                                onChange={handleForFile}
                            />
                        </Form.Group>
                    </Tab>
                    {/* ---------------------------------------------------------------------- */}
                    <Tab
                        eventKey='loadTab2'
                        title='z URL'
                        className='rounded-0 '>
                        <Form.Group
                            className='my-2 p-2'
                            controlId='inputFromURL1'>
                            <Form.Label xs={12} className='fs-6 text-primary'>
                                URI adresa zdrojového souboru
                            </Form.Label>
                            <div xs={12} className='d-flex'>
                                <Form.Control
                                    className='form-control'
                                    disabled={loading}
                                    type='text'
                                    size='sm'
                                    name='fileName2'
                                    value={inpUri}
                                    placeholder='Vlož adresu zdroje ...'
                                    onChange={handleUriInput}
                                />
                                <Button
                                    className='btn-sm ms-2'
                                    name='inputFromURL'
                                    onClick={() => handleForURL(inpUri)}
                                    disabled={loading}>
                                    Načti
                                </Button>
                            </div>
                        </Form.Group>
                    </Tab>
                    {/* ---------------------------------------------------------------------- */}
                    <Tab
                        eventKey='loadTab3'
                        title='Testovací zdroje'
                        className='rounded-0 '>
                        <div className='my-2 p-2'>
                            <Form.Label xs={12} className='fs-6 text-primary'>
                                Načíst soubor z URL (pro testování):
                            </Form.Label>
                            <br />
                            <Button
                                className='btn-sm'
                                name='inputFromURL'
                                value={testFile + "1"}
                                onClick={() => handleForURL(testFile + "1")}
                                disabled={loading}>
                                Načíst JSON MLS
                            </Button>
                            <Button
                                className='btn-sm ms-3'
                                name='inputFromURL'
                                value={testFile + "2"}
                                onClick={() => handleForURL(testFile + "2")}
                                disabled={loading}>
                                Načíst XML GPX malý
                            </Button>
                            <Button
                                className='btn-sm ms-3'
                                name='inputFromURL'
                                value={testFile + "3"}
                                onClick={() => handleForURL(testFile + "3")}
                                disabled={loading}>
                                Načíst XML GPX velký
                            </Button>
                        </div>
                    </Tab>
                    {/* ---------------------------------------------------------------------- */}
                </Tabs>
            </Form>
        </>
    );
}

export default FormControl;
