<?php

$html = file_get_contents('https://quotes.toscrape.com/');
libxml_use_internal_errors(true);

$dom = new DOMDocument();
$dom->loadHTML($html);
libxml_use_internal_errors(false);

$xpath = new DOMXPath($dom);
$quotes_container_xpath = '//div[@class="quote"]';
$quotes_container = $xpath->query($quotes_container_xpath);

$quotes = array();
$i = 0;
foreach ($quotes_container as $quote_box) {
    $author = $xpath->query('.//*[contains(@class, "author")]', $quote_box)[0]->nodeValue;
    $quote = $xpath->query('.//span[contains(@class, "text")]', $quote_box)[0]->nodeValue;
    $quotes[$i] = array("author" => $author, "quote" => $quote);
    
    $i++;
}

header("Content-Type: application/json");
echo json_encode($quotes)
?>
