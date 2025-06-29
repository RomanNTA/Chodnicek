<?php

//------------------------------------------------------------------------
//   DEFINICE
//------------------------------------------------------------------------
interface ServerIterface
{
    // RESPONSE_CODE -> RC

    //  500 - Internal Server Error
    const RC_500_INT_SERVER_ERROR = 500;

    // Bad Request
    const RC_400_BAD_REQUEST = 400;

    // Created
    const RC_201_CREATED = 201;

    // OK
    const RC_200_OK = 200;

    // Method Not Allowed
    const RC_405_METHOD_NOT_ALLOWED = 405;

    // Not Found
    const RC_404_NOT_FOUND = 404;

    // Předletový požadavek CORS
    const RC_200_CORS = 200;



    public function sendAnswer($message, $code = 0);

    public function setService($name, $procedure);

    public function service_run();

    public function log_message($message);
};
