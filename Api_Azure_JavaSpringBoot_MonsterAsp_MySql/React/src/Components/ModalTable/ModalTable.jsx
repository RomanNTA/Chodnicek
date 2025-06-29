import React, { useState } from "react";
import { TbSettingsDown } from "react-icons/tb";
import FormControl from "../FormControl/FormControl";
import FileProcessor from "../FileProcessor/FileProcessor";

import { ModalContext } from "../../GlobalContext";

import { Button, Tab, Alert, Tabs, Modal } from "react-bootstrap";

import "../../Functions/parsers";

function ModalTable() {
    // -------------------------------------------------

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [alertShow, setAlertShow] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    const [page, setPage] = useState(1);

    const EmptyFormControl = {
        fileName: "",
        contextName: "",
        comments: "",
        rawData: "",
        isValid: false,
    };

    function handleOnChangeTab2(e) {
        setPage(e?.target?.id === "TabsHandler-tab-tab2" ? 2 : 1);
        setAlertShow(false);
        setAlertMessage("");
        setAlertType("");
    }

    const ModalContextValues = {
        //show,
        setShow,
        //alertShow,
        setAlertShow,
        //alertType,
        setAlertType,
        //alertMessage,
        setAlertMessage,
        EmptyFormControl,
        page,
        setPage,
        handleOnChangeTab2,
    };

    // /////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <Button className='n-button-icons' onClick={handleShow}>
                <TbSettingsDown />
            </Button>
            <ModalContext.Provider value={ModalContextValues}>
                <Modal
                    show={show}
                    onHide={handleClose}
                    size='lg'
                    className='modal n-pointer-events-all contained-modal-title-vcenter '
                    backdrop='static'
                    aria-labelledby='contained-modal-title-vcenter'
                    //
                >
                    <Modal.Header closeButton>
                        <Modal.Title id='contained-modal-title-vcenter'>
                            Načtení / výběr zdroje
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs
                            onClick={handleOnChangeTab2}
                            defaultActiveKey='tab1'
                            id='TabsHandler'
                            className='mb-2 rounded-0 tabs'>
                            {/* ---------------------------------------------------------------------- */}
                            <Tab
                                onClick={() => setPage(1)}
                                eventKey='tab1'
                                title='Přehled zdrojů'
                                className='rounded-0 '
                                value='1'>
                                {/* <FileProcessor setShow={setShow} /> */}
                                <FileProcessor />
                            </Tab>
                            {/* ---------------------------------------------------------------------- */}
                            <Tab
                                onClick={() => setPage(2)}
                                eventKey='tab2'
                                title='Nahrání souboru'
                                className='rounded-0 '
                                value='2'>
                                <FormControl />
                            </Tab>
                            {/* ---------------------------------------------------------------------- */}
                        </Tabs>
                        <Alert
                            show={alertShow}
                            key={alertType}
                            variant={alertType}>
                            {alertMessage}
                        </Alert>
                        {/* <AlertControl /> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-sm' onClick={handleClose}>
                            Zavřít
                        </Button>
                    </Modal.Footer>
                </Modal>
            </ModalContext.Provider>
        </>
    );
}

export default ModalTable;
