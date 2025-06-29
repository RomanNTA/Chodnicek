<?php

require_once  './ServicePDO.php';
require_once  './ServiceProcedure.php';

class ServiceDelete implements ServiceProcedure
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
            $delete_id = $data->id;
        } catch (Exception $e) {
            return [
                "message" => "DELETE: Chyba při vstupnim překladu hodnot: " . $e->getMessage(),
                "status" => -2
            ];
        }
        //------------------------------------------------------------------------
        if (isset($delete_id)) {
            $sql = "DELETE FROM zpravy WHERE id = :id";
            try {
                $result = $pdo->pdo->prepare($sql);
                $result->bindParam(':id', $delete_id, PDO::PARAM_INT);
                $result->execute();

                if ($result->rowCount() > 0) {
                    return [
                        "message" => "Smazání bylo úspěšné.",
                        "status" => 2
                    ];
                } else {
                    return [
                        "message" => "Záznam s ID " . $delete_id . " nebyl nalezen.",
                        "status" => -3
                    ];
                }
            } catch (PDOException $e) {
                return [
                    "message" => "Chyba při odstranění položky: " . $e->getMessage(),
                    "status" => -1
                ];
            }
        } else {
            return [
                "message" => "Chybějící nebo neplatná data pro odstranění položky.",
                "status" => -2
            ];
        }
    }
}
