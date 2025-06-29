<?php
//------------------------------------------------------------------------
//   DEFINICE
//------------------------------------------------------------------------
define('pAppWeb', realpath(__DIR__ . DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR);

define('GET', "GET");           // SELECT
define('POST', "POST");         // INSERT 
define('PUT', "PUT");           // UPDATE
define('DELETE', "DELETE");     // DELETE
define('OPTIONS', "OPTIONS");   // OPTIONS

define('ALLOWED_TASKS', [GET, PUT, POST, DELETE, OPTIONS]);

require_once  pAppWeb . 'ServerDbConst.php';
require_once  pAppWeb . 'ServiceProcedure.php';
require_once  pAppWeb . 'ServicePDO.php';

require_once  pAppWeb . 'ServiceGet.php';
require_once  pAppWeb . 'ServicePost.php';
require_once  pAppWeb . 'ServicePut.php';
require_once  pAppWeb . 'ServiceDelete.php';

require_once  pAppWeb . 'ServerIterface.php';
require_once  pAppWeb . 'ServerImpl.php';

//------------------------------------------------------------------------
//   
//------------------------------------------------------------------------
$server = new ServerImpl();
// $server->setService(GET, new ServiceGet);
// $server->setService(POST, new ServicePost);
// $server->setService(PUT, new ServicePut);
// $server->setService(DELETE, new ServiceDelete);

$server->setService(GET, 'ServiceGet');
$server->setService(POST, 'ServicePost');
$server->setService(PUT, 'ServicePut');
$server->setService(DELETE, 'ServiceDelete');

$server->service_run();
