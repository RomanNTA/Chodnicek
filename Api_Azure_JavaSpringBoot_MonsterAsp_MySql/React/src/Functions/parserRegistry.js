// Map pro uložení parsovacích funkcí. Klíč: "type_modification"
const parserRegistry = new Map();

/**
 * Registruje parsovací funkci pro daný typ a modifikaci souboru.
 * @param {string} type Typ souboru (např. 'json', 'xml').
 * @param {string} modification Modifikace souboru
 * @param {function(string): Promise<Map<string, any>>} parserFunction
 * Asynchronní funkce, která přijímá obsah souboru (string) a vrací Promise s Mapou.
 */
export function registerParser(type, modification, parserFunction) {
    const newKey = `${type}_${modification}`;
    if (parserRegistry.has(newKey)) {
        console.warn(
            `Parser pro klíč ${newKey} Je zaregistrován. Byl přepsán !!!`
        );
    }
    parserRegistry.set(newKey, parserFunction);
}

/**
 * Získá parsovací funkci pro daný typ a modifikaci.
 * @param {string} type
 * @param {string} modification
 * @returns {function(string): Promise<Map<string, any>> | undefined}
 */
export function getParser(type, modification) {
    const key = `${type}_${modification}`;
    return parserRegistry.get(key);
}

/**
 * Hlavní funkce pro parsování souboru na základě detekovaného typu.
 * @param {string} content Obsah souboru.
 * @param {string} type Typ souboru.
 * @param {string} modification Modifikace souboru.
 * @returns {Promise<Map<string, any>>} Promise s Mapou extrahovaných dat.
 * @throws {Error} Pokud není nalezen žádný parser.
 */
export async function parseFileContent(content, type, modification) {
    // console.log("parserRegistry");
    // console.log(parserRegistry);

    const parser = getParser(type, modification);
    if (parser) {
        return await parser(content);
    }
    throw new Error(
        `Parser pro tento typ souboru není registrován [type: ${type}, modification: ${modification}]`
    );
}
