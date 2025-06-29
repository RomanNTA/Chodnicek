<?php

require_once  './ServicePDO.php';
require_once  './ServiceProcedure.php';

//------------------------------------------------------------------------
class ServicePut implements ServiceProcedure
//------------------------------------------------------------------------
{
    public function service($data): array
    {
        //------------------------------------------------------------------------
        $pdo = ServicePDO::getInstance();
        if ($pdo->isError) {
            return [
                "message" => "Chyba připojení databáze",
                "json" => "",
                "status" => -1
            ];
        }
        //------------------------------------------------------------------------
        try {
            $id = $data->sendData->id;
            $text_zpravy = $data->sendData->text_zpravy;
            $cislo = $data->sendData->cislo;
        } catch (Exception $e) {
            return [
                "message" => "POST: Chyba při vstupnim překladu hodnot: " . $e->getMessage(),
                "status" => -2
            ];
        }
        //------------------------------------------------------------------------
        if (isset($id) && isset($cislo) && isset($text_zpravy)) {

            $sql = "UPDATE zpravy SET cislo = :cislo, text_zpravy = :text WHERE id = :id";
            try {
                $result = $pdo->pdo->prepare($sql);

                $result->bindParam(':id', $id, PDO::PARAM_INT);
                $result->bindParam(':cislo', $cislo, PDO::PARAM_INT);
                $result->bindParam(':text', $text_zpravy, PDO::PARAM_STR, 128);

                $result->execute();

                if ($result->rowCount() > 0) {
                    return [
                        "message" => "Změna byla úspěšná.",
                        "status" => 1
                    ];
                } else {
                    return [
                        "message" => "Uživatel s ID " . $id . " nebyl nalezen.",
                        "status" => -3
                    ];
                }
            } catch (PDOException $e) {
                return [
                    "message" => "Chyba při vložení: " . $e->getMessage(),
                    "status" => -1
                ];
            }
        } else {
            return [
                "message" => "Chybějící nebo neplatná data pro aktualizaci položky.",
                "status" => -2
            ];
        }
    }
}
