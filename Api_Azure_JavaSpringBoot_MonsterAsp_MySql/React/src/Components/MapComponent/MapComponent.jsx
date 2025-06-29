import React from "react";

import { useState, useEffect, useContext } from "react";
import "./MapComponent.css";

import {
    MapContainer,
    TileLayer,
    CircleMarker,
    useMapEvents,
    Polyline,
} from "react-leaflet";

import { MapContext } from "../../GlobalContext";

/**
 *
 */
function MapComponent() {
    //
    const M = useContext(MapContext);
    const [viewport, setViewport] = useState(null);

    function MyZoomListener() {
        //
        const [currentZoom, setCurrentZoom] = useState(null);
        //
        const map = useMapEvents({
            zoomend: () => {
                // Událost 'zoomend' se spustí po dokončení animace zoomu
                let z = map.getZoom();
                setCurrentZoom(z);
                M.setZoom(z);
            },
        });
        return <></>;
    }

    useEffect(() => {
        //
        let c = M?.posOnRoute?.coordinates;
        if (c === null || c === undefined || c.length === 0) return;

        let p1 = c[0][0] || 0;
        let p2 = c[0][1] || 0;

        if (p1 === 0 || p2 === 0) return;
        if (viewport === null) return;
        if (
            viewport.LDlat === 0 ||
            viewport.LDlng === 0 ||
            viewport.PHlat === 0 ||
            viewport.PHlng === 0
        )
            return;

        if (
            !(
                viewport.LDlat < p1 &&
                viewport.PHlat > p1 &&
                viewport.LDlng < p2 &&
                viewport.PHlng > p2
            )
        ) {
            M.setPosition([p1, p2]);
        }
    }, [M.posOnRoute.coordinates]);

    function CurrentViewport() {
        const map = useMapEvents({
            moveend: () => {
                const v = map.getBounds();

                //Severovýchod
                let x1 = parseFloat(v?.getNorthEast()?.lat?.toFixed(4) || 0);
                let y1 = parseFloat(v?.getNorthEast()?.lng?.toFixed(4) || 0);

                // Jihozápad
                let x2 = parseFloat(v?.getSouthWest()?.lat?.toFixed(4) || 0);
                let y2 = parseFloat(v?.getSouthWest()?.lng?.toFixed(4) || 0);

                // LD ... levý dolní, PH ... pravý horní
                setViewport({ LDlat: x2, LDlng: y2, PHlat: x1, PHlng: y1 });
            },
        });

        return <></>;
    }

    /** -----------------------------------------------------------------------------------------------------------
    *   Aktualizace polohy a zvětšení mapy
   ------------------------------------------------------------------------------------------------------------ */
    useEffect(() => {
        if (M.mapa != null) {
            M.mapa.flyTo(M.position, M.zoom);
        } else {
            console.error(`Nenastaveno ... mapa není k dispozici.`);
        }
    }, [M.position]);

    const routePolyOptions = { color: "black", opacity: 0.4, weight: 12 };
    return (
        <>
            <div className='w-100 h-100 '>
                <MapContainer
                    className='overflow-map'
                    center={M.position}
                    zoom={M.zoom}
                    scrollWheelZoom={true}
                    key={"00-3654654-asd-bvbvb"}
                    maxZoom={18}
                    ref={M.setMapa}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    {M.coordinates && (
                        <Polyline
                            key={122}
                            positions={M.coordinates}
                            pathOptions={routePolyOptions}
                        />
                    )}
                    {M.posOnRoute.isShow && (
                        <CircleMarker
                            center={M.posOnRoute.coordinates[0]}
                            radius={8}
                            color='red'
                            fillColor='red'
                            fillOpacity={0.8}
                        />
                    )}
                    <MyZoomListener />
                    <CurrentViewport />
                </MapContainer>
            </div>
        </>
    );
}

export default MapComponent;
