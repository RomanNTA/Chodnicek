<?php
//------------------------------------------------------------------------
//   DEFINICE
//------------------------------------------------------------------------



//------------------------------------------------------------------------
//   
//------------------------------------------------------------------------
class ServerImpl implements ServerIterface
{
    protected string $receivedJSON;
    private $handlers = [];

    //------------------------------------------------------------------------
    //  HANDLERs
    //------------------------------------------------------------------------
    public function setService($name = "", $procedure = ""): void
    {
        if (trim($name) != "" && trim($procedure) != "" && in_array(trim($name), ALLOWED_TASKS, true)) {
            $this->handlers[$name]  = $procedure;
        } else {
            throw new Exception("setService: Chyba volání metody.");
        }
    }


    // public function setService($name = "", ServiceProcedure $procedure = null): void
    // {
    //     if ($name != null && $name != "" && $procedure != null && in_array($name, ALLOWED_TASKS, true)) {
    //         $this->handlers[$name]  = $procedure;
    //     } else {
    //         throw new Exception("setService: Chyba volání metody.");
    //     }
    // }
    //------------------------------------------------------------------------
    public function __construct()
    {
        $this->sendHeaders();
        $this->log_message("__construct");
    }
    //------------------------------------------------------------------------
    public function sendAnswer($message, $code = 0)
    {
        if ($code) {
            http_response_code($code);
        }
        if ($message) {
            echo json_encode(array("message" => $message));
        }
    }
    //------------------------------------------------------------------------
    public function service_run()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $this->receivedJSON = file_get_contents("php://input");
        $dataArray = json_decode($this->receivedJSON);

        $this->log_message("receivedJSON " . $method);
        $this->log_message($this->receivedJSON);

        if ($dataArray == null) {
            $dataArray = [];
        }

        // $this->log_message("service_run");

        // ob_start();
        // var_dump($dataArray);
        // $output = ob_get_contents();
        // ob_end_clean();
        // $this->log_message($output);

        //------------------------------------------------------------------------
        switch ($method) {

            case 'GET':
            case 'POST':
            case 'PUT':
            case 'DELETE':
                if ($this->handlers[$method] != null) {
                    //$result = ($this->handlers[$method])->service($dataArray);

                    $result = [];
                    if (class_exists($this->handlers[$method])) {
                        $trida = new ($this->handlers[$method]);
                        if ($trida instanceof ServiceProcedure) {
                            $result = $trida->service($dataArray);
                        } else {
                            $result["message"] = 'Není to instanceof ServiceProcedure';
                        }
                    } else {
                        $result["message"] = 'Není to platný odkaz na object.';
                    }
                    // --------------------------------------------------------------------------------
                    switch (($result["status"])) {
                        case 100:
                            echo $result["json"];
                            break;
                        // ----------------------------------------------------------------------------
                        case 1:
                            $this->sendAnswer($result["message"], self::RC_201_CREATED);
                            break;
                        case 2:
                            $this->sendAnswer($result["message"], self::RC_200_OK);
                            break;
                        // ----------------------------------------------------------------------------
                        case -2:
                            $this->sendAnswer($result["message"], self::RC_400_BAD_REQUEST);
                            break;
                        case -3:
                            $this->sendAnswer($result["message"], self::RC_404_NOT_FOUND);
                            break;
                        // ----------------------------------------------------------------------------
                        default:
                            $this->sendAnswer($result["message"], self::RC_500_INT_SERVER_ERROR);
                            break;
                            // ------------------------------------------------------------------------
                    }
                }
                break;
            //------------------------------------------------------------------------
            case 'OPTIONS':
                //------------------------------------------------------------------------
                // Předletový požadavek CORS
                // Pozor !!! Standardně se neposílá text .... nevím, zda tu funkci možno použít.
                $this->sendAnswer("", self::RC_200_CORS);
                break;

            //------------------------------------------------------------------------
            default:
                //------------------------------------------------------------------------
                $this->sendAnswer("Nepodporovaná metoda.", self::RC_405_METHOD_NOT_ALLOWED);
                break;
                //------------------------------------------------------------------------
        }
    }


    //------------------------------------------------------------------------
    public function log_message($message)
    {
        $log_file = pAppWeb . 'error.log';
        $timestamp = date('Y-m-d H:i:s');
        //error_log("[{$timestamp}] {$message}\n", 3, $log_file);
        //var_dump($message);
        error_log("[{$timestamp}] {$message}\n", 3, $log_file);
    }

    public function sendHeaders()
    {   // Povolení CORS (Cross-Origin Resource Sharing) pro umožnění požadavků z React aplikace
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }
}
