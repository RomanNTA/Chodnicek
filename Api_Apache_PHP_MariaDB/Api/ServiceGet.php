<?php

require_once  './ServicePDO.php';
require_once  './ServiceProcedure.php';

class ServiceGet implements ServiceProcedure
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
        $sql = "SELECT id, cislo,text_zpravy  FROM zpravy";
        try {
            $result = $pdo->pdo->prepare($sql);
            $result->execute();
            $results = $result->fetchAll(PDO::FETCH_ASSOC);
            //json_encode($results);
            return [
                "message" => $results,
                "json" => json_encode($results),
                "status" => 100
            ];
        } catch (PDOException $e) {
            return [
                "message" => "Chyba při SELECT: " . $e->getMessage(),
                "status" => -2
            ];
        }
    }
}
