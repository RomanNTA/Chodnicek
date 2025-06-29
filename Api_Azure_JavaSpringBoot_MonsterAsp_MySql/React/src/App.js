import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import MapComponent from "./Components/MapComponent/MapComponent";
import { FaInfoCircle } from "react-icons/fa";
import CardBts from "./Components/CardBts/CardBts";
import ModalTable from "./Components/ModalTable/ModalTable";

import { Container, Row, Button, Col, Form } from "react-bootstrap";
import { MapContext, DataContext } from "./GlobalContext";

const infoPage = process.env.REACT_APP_URL_INFO;

function App() {
    /*
     * Mapa hook pro MapContextValues
     */
    const [position, setPosition] = useState([49.7862914, 18.2686792]);
    const [zoom, setZoom] = useState(10);
    const [mapa, setMapa] = useState();
    const [coordinates, setCoordinates] = useState();

    const constEmptyPosOnRoute = {
        position: 0,
        min: 0,
        max: 0,
        coordinates: [],
        isShow: false,
    };
    const [posOnRoute, setPosOnRoute] = useState(constEmptyPosOnRoute);

    /**
     * MapContextValues
     */
    const MapContextValues = {
        //
        //  position obsahuje koordináty na centrování výřezu mapy
        position,
        setPosition,

        //  zoom obsahuje změtšení mapy. Zatím jen jednosměrně.
        zoom,
        setZoom,

        //  mapa obsahuje základní objekt mapy
        mapa,
        setMapa,

        //  coordinates obsahují pole souřadnic pro zobrazení trasy objektu
        coordinates,
        setCoordinates,

        //  posOnRoute obsahuje bod podle posuvníku a určuje objekt v určitém čase a bodě.
        posOnRoute,
        setPosOnRoute,
        //
    };

    const [data, setData] = useState(null);
    //  ---- pro FileProcessor
    const [uploadedFiles, setUploadedFiles] = useState(null); // Seznam souborů (ID, název, ...)
    const [eventReloadData, setEventReloadData] = useState(false);

    const DataContextValues = {
        eventReloadData,
        setEventReloadData,

        data,
        setData,

        uploadedFiles,
        setUploadedFiles,
    };

    /**
     * metoda handleChangePozice
     */
    const handleChangePosOnRoute = (e) => {
        //
        if (!posOnRoute.isShow) return;
        //

        let [val, name, id] = [e.target.value, e.target.name, e.target.id];
        val = parseInt(val);

        let tmp = {
            ...posOnRoute,
            position: val,
            coordinates: coordinates[val],
        };

        setPosOnRoute(tmp);
    };

    /** -------------------------------------------------------------------------------------------------------
      *   Aktualizace nových dat
      ------------------------------------------------------------------------------------------------------- */
    useEffect(() => {
        if (!data) return;
        if (!data?.has("uuid")) return;

        // 0:(2) ['coordinates', Array(7)]
        // 1:(2) ['cellTowers', Array(7)]
        // 2:(2) ['timestamp', Array(7)]
        // 3:(2) ['position', Array(2)]
        // 4:(2) ['uuid', 'fd0910b9-f676-4b4c-962f-f85752fdfd68']
        // 5:(2) ['contextName', '']
        // 6:(2) ['fileName', '2025-05-20-19-52-43.gpx']
        // 7:(2) ['comments', '']
        // 8:(2) ['btsInfo', Array(4)]
        // 9:(2) ['src', 'LOCAL-DB']
        // 10:(2) ['typeSrc', 'TEXT-FILE']

        let c = data?.get("coordinates");
        setCoordinates(c);

        // počet souřadnic nesmí být nulový
        if (!c.length > 0) return;
        let tmp = {
            position: 0,
            min: 0,

            max: c.length - 1 || 0,
            //První pozice
            coordinates: c[0],
            isShow: true,
        };
        setPosOnRoute(tmp);
        setPosition(data.get("position"));
        setZoom(16);
    }, [data, setPosition]);

    /**
     * App
     */
    return (
        <>
            <DataContext.Provider value={DataContextValues}>
                <MapContext.Provider value={MapContextValues}>
                    <Container fluid className='w-100 h-100 p-0 m-0 z-n1'>
                        <MapComponent />
                    </Container>
                    <div className='n-panel-parent d-flex align-items-end'>
                        <Container
                            xs={12}
                            lg={6}
                            className='z-3 d-flex align-items-end justify-content-center pb-5 '>
                            <Row className='z-3 m-0 n-panel p-2 n-pointer-events-all justify-content-center w-75'>
                                {/* ---------------------------------------------------------------------- */}
                                <Col
                                    xs={12}
                                    lg={12}
                                    className='m-0 px-2 d-inline-block mx-auto align-self-stretch d-flex'>
                                    <CardBts />
                                </Col>

                                <Col
                                    xs={2}
                                    lg={1}
                                    className='z-3 my-auto d-inline-block align-items-start'
                                    style={{ width: "70px" }}>
                                    <ModalTable />
                                </Col>

                                {/* Vrchní vrstva - ovládací prvky pevně dole                              */}
                                {/* ---------------------------------------------------------------------- */}
                                <Col
                                    xs={10}
                                    lg={11}
                                    className='z-3 d-flex d-inline-block flex-column my-auto'>
                                    <div className='d-flex d-inline-block'>
                                        <div className='w-100'>
                                            <Form.Label htmlFor='posOnRoute'>
                                                č. pozice na trase{" "}
                                                {posOnRoute.position}
                                            </Form.Label>
                                            <Form.Range
                                                className='mt-0 '
                                                name='posOnRoute'
                                                id='posOnRoute'
                                                min={posOnRoute.min}
                                                max={posOnRoute.max}
                                                value={posOnRoute.position}
                                                onChange={
                                                    handleChangePosOnRoute
                                                }
                                            />
                                        </div>
                                        <div className='pt-2 ps-4'>
                                            <a
                                                href={infoPage}
                                                target='_blank'
                                                rel='noopener noreferrer'>
                                                <Button
                                                    className='n-button-icons'
                                                    onClick={() => {}}>
                                                    <FaInfoCircle className='' />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                                {/* ---------------------------------------------------------------------- */}
                            </Row>
                        </Container>
                    </div>
                </MapContext.Provider>
            </DataContext.Provider>
        </>
    );
}

export default App;
