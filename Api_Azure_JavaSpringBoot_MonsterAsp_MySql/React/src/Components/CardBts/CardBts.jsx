import "./CardBts.css";

import { useState, useEffect, useContext } from "react";
import { MapContext, DataContext } from "../../GlobalContext";

import Card from "react-bootstrap/Card";
import { LuRadioTower } from "react-icons/lu";
import { IoMdTime } from "react-icons/io";

// ----------------  FORMATOVANI DATUMU A CASU  ---------------------------------
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);

    const fr = (val, len) => {
        return String(val).padStart(len, "0");
    };

    return (
        `${fr(a.getDate(), 2)}.${fr(a.getMonth(), 2)}.${a.getFullYear()}` +
        ` ${fr(a.getHours(), 2)}:${fr(a.getMinutes(), 2)}`
    );
}

const EmptyTime = " ...";

const EmptyInfo = {
    adresa: "-",
    band: 0,
    cellid: " ...",
    gsmcid: 0,
    id: 0,
    okres: "-",
    physcid: 0,
    tac: 0,
};

// ----------------  KOMPONNTA ---------------------------------------------------
function CardBts() {
    const M = useContext(MapContext);
    const D = useContext(DataContext);
    const [actualBts, setActualBts] = useState(EmptyInfo);
    const [timSt, setTimSt] = useState(EmptyTime);

    /** -------------------------------------------------------------------------------------------------------------------
     *   Aktualizace informaci o pozici objektu
     * ------------------------------------------------------------------------------------------------------------------- */
    useEffect(() => {
        //
        console.log(
            `CARD: Nastavuji novou pozici objektu. ${M.posOnRoute.coordinates[0]} + zobrazit = ${M.posOnRoute.isShow} + M.position = ${M.position};`
        );

        if (!M.posOnRoute.isShow) return;
        if (D.data?.isEmpty) return;

        const index = M.posOnRoute.position;
        const bts = D.data.get("btsInfo");

        let timSt = D.data.get("timestamp")[index] || -1;
        if (timSt !== -1) {
            timSt = timeConverter(timSt);
            setTimSt(timSt);
        } else {
            timSt = EmptyTime;
        }

        let cellId = D.data.get("cellTowers")[index].cellId || -1;

        if (bts) {
            let b = bts.filter((x) => x.cellid == cellId);
            if (!b) return;
            setActualBts(b[0] || EmptyInfo);
        }
    }, [M.posOnRoute.position, M.posOnRoute.isShow]); // ,

    // ------------------------------------------------------------------------------------------------
    //   GetInfo ... komponenta - vrací informace o BTSce
    // ------------------------------------------------------------------------------------------------
    const GetInfo = () => {
        //
        if (!M.posOnRoute.isShow) return "...";
        //

        return (
            <>
                {actualBts.okres || "-"}&nbsp;&nbsp;...&nbsp;&nbsp;
                {actualBts.adresa || "-"}
                <br />
                band :&nbsp;
                <span className='fw-bolder'>{actualBts.band || 0}</span>
                &nbsp;&nbsp;cellid :&nbsp;
                <span className='fw-bolder'>{actualBts.cellid || ""}</span>
                &nbsp;&nbsp;gsmcid :&nbsp;
                <span className='fw-bolder'>{actualBts.gsmcid || ""}</span>
                &nbsp;&nbsp;id :&nbsp;
                <span className='fw-bolder'>{actualBts.id || ""}</span>
                &nbsp;&nbsp;physcid :&nbsp;
                <span className='fw-bolder'>{actualBts.physcid || ""}</span>
                &nbsp;&nbsp;tac :&nbsp;
                <span className='fw-bolder'>{actualBts.tac || ""}</span>
            </>
        );
    };

    return (
        <>
            <Card
                bg={"Light"}
                key={"Light"}
                text={"dark"}
                className='w-100 m-0 px-2 align-self-stretch d-flex '>
                <Card.Header className='pt-3 pb-2'>
                    <LuRadioTower className='fs-3' />
                    &nbsp;&nbsp;
                    <span className='text-body-primary text-danger fw-bolder p-0 m-0 fs-5'>
                        {actualBts.cellid}
                    </span>{" "}
                    <IoMdTime className='fs-3 ms-5 me-2' />
                    <span className='text-body-primary text-danger fw-bolder p-0 m-0 fs-5'>
                        {timSt}
                    </span>{" "}
                </Card.Header>
                <Card.Body className='m-0 p-0 '>
                    <Card.Text className='n-text-wrap lh-lg my-1'>
                        <GetInfo />
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}

export default CardBts;
