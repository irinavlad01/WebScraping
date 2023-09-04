<?php

$jsonData = file_get_contents('php://input');
$dataArray = json_decode($jsonData);
$serverUrl = 'http://localhost:4000/quotes';

$allElementsSent = true;
foreach ($dataArray as $dataObject) {
    $jsonObject = json_encode($dataObject);
    $headers = [
        'Content-Type: application/json',
    ];

    $context = stream_context_create([
        'http' => [
            'header' => implode("\r\n", $headers),
            'method' => 'POST',
            'content' => $jsonObject
        ]
    ]);

    // Add a delay before sending the GET request
    usleep(1000000); // Delay for 1 second (in microseconds)

    $response = file_get_contents($serverUrl, false, $context);

    if ($response === false) {
        $allElementsSent = false;
    }
}

if($allElementsSent) {
    echo '1';
}
else {
    echo 'One or many elements have not been inserted in JSON-SERVER due an error';
}

?>
