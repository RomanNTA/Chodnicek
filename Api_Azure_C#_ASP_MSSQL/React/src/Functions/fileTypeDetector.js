import { detectorIsFileAsMLS } from "./detectors/detectorIsFileAsMLS";
import { detectorIsFileAsGPX_1_1 } from "./detectors/detectorIsFileAsGPX_1_1";

/**
 * Detekuje typ a modifikaci souboru na základě jeho obsahu a názvu.
 * @param {string} content Obsah souboru jako řetězec.
 * @param {string} fileName Název souboru.
 * @returns {{type: string, modification: string}|null} Objekt s typem a modifikací, nebo null pokud nelze detekovat.
 */
export function detectFileTypeAndModification(content, fileName) {
    //
    if (!content) return null;
    if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
        // 1. Detekce podle obsahu (preferované)
        // Zkusíme JSON
        try {
            //
            const json = JSON.parse(content);
            if (detectorIsFileAsMLS(content)) {
                return { type: "json", modification: "MLS-V1" };
            }
        } catch (e) {
            // Není to validní JSON, pokračujeme
        }
    }

    if (content.trim().startsWith("<") && content.trim().endsWith(">")) {
        // Zkusíme parsovat jako XML ...

        try {
            if (detectorIsFileAsGPX_1_1(content)) {
                return { type: "xml", modification: "GPX-v1.1" };
            }
        } catch (e) {
            // Není to validní XML
        }
    }

    return null; // Typ a modifikace nelze detekovat
}
