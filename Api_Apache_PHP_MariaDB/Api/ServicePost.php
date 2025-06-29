<?php

require_once  './ServicePDO.php';
require_once  './ServiceProcedure.php';

class ServicePost implements ServiceProcedure
{
    public function service($data): array
    {
        //------------------------------------------------------------------------
        $pdo = ServicePDO::getInstance();
        if ($pdo->isError) {
            return [
                "message" => "Chyba připojení databáze",
                "status" => -1
            ];
        }
        //------------------------------------------------------------------------
        try {
            $txt = $data->sendData->text_zpravy;
            $cislo = $data->sendData->cislo;
        } catch (Exception $e) {
            return [
                "message" => "POST: Chyba při vstupnim překladu hodnot: " . $e->getMessage(),
                "status" => -2
            ];
        }
        if (isset($cislo) && isset($txt)) {

            $sql = "INSERT INTO zpravy (cislo, text_zpravy) VALUES (:cislo, :text_zpravy)";
            try {
                $result = $pdo->pdo->prepare($sql);
                $result->bindParam(':cislo', $cislo);
                $result->bindParam(':text_zpravy', $txt);
                $result->execute();
                return [
                    "message" => "Vložení do databáze bylo úspěšné.",
                    "status" => 1
                ];
            } catch (PDOException $e) {
                return [
                    "message" => "Chyba při vložení: " . $e->getMessage(),
                    "status" => -1
                ];
            }
        } else {
            return [
                "message" => "Chybějící data pro vložení do databáze: ",
                "status" => -2
            ];
        }
    }
}
