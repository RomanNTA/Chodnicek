<!DOCTYPE html>
<html lang="cs-cz">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tester HTTP - CURL</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>
    <div class="container p-3" style="background-color: #f7f7f7;">
        <h1 class="py-5 text-danger">Tester HTTP - CURL</h1>

        <?php

        // Adresa serveru, kde běží cílový PHP skript
        $targetUrl = 'http://pc-nta:8060/ServerService.php';

        // odeslání požadavku pomocí CURL metod
        function sendRequest($metoda, $url, $data = null)
        {
            $ch = curl_init($url);

            // Vrátí odpověď jako string
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            // Nastaví HTTP metodu
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $metoda);

            if ($data) {
                //curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data)); // Data pro POST, PUT, DELETE
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Data pro POST, PUT, DELETE
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json')); // Nastaví Content-Type
            }

            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                echo 'Curl error: ' . curl_error($ch);
            }

            curl_close($ch);

            $s = "<div class='container'>";
            $s .= "<h1>{$metoda}</h1>";
            $s .= "<p><b>{$data}</b></p>";
            //$s .= "<xmp>" . htmlspecialchars($response) . "</xmp>";
            $s .= "<xmp class='text-wrap'>" . $response . "</xmp>";
            $s .= "</div>";

            return $s;
        }

        echo sendRequest('GET', $targetUrl . '?param1=get_value1&param2=get_value2') . "\n\n";

        $testData = '{"sendData":{"text_zpravy":"Otakárek","cislo":"31415"}}';
        echo sendRequest('POST', $targetUrl, $testData);

        $testData = '{"sendData":{"id":46,"text_zpravy":"Nejsi Debilek !","cislo":654654,"isValid":true,"isUpdate":true}}';
        echo sendRequest('PUT', $targetUrl, $testData);

        $testData = '{"id":"43"}';
        echo sendRequest('DELETE', $targetUrl, $testData);

        ?>
    </div>
</body>

</html>