<?php

require_once "./ServerDbConst.php";

class ServicePDO
{
    private $DbConst = [];
    private static $instance = null;

    public $isError = false;
    public $resultMessage = "";
    public $pdo;

    private function __construct()
    {
        global $DbConst;
        $this->DbConst = $DbConst;

        try {
            $connection = sprintf('mysql:host=%s; dbname=%s', $this->DbConst["HOST"], $this->DbConst["DBNAME"]);
            $this->pdo = new PDO(
                $connection,
                $this->DbConst['USERNAME'],
                $this->DbConst['PASSWORD'],
                array(
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8 COLLATE utf8_general_ci",
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION
                )
            );
            $this->isError = false;
        } catch (PDOException $e) {
            $this->isError = true;
            $this->resultMessage = "Připojení k databázi selhalo: " . $e->getMessage();
        }
    }

    public static function getInstance()
    {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // Zamezení klonování
    private function __clone() {}
    // Zamezení deserializace
    public function __wakeup() {}
}
