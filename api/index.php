<?php
    ini_set('display_errors','on');

    header("Access-Control-Allow-Origin:" . "*");
    header('Content-Type: text/html; charset=utf-8');

    $count = $_POST['count'];

    function text($count) {
        if( $curl = curl_init() ) {
            curl_setopt($curl, CURLOPT_URL, 'https://fish-text.ru/get?type=paragraph&number=' . $count);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
            $out = curl_exec($curl);
            curl_close($curl);
        }

        $res = json_decode($out, true);

        $res = explode('\n\n', $res['text']);
        $last = array_pop($res);
        return $res;
    }

    echo json_encode(['count' => $count, 'text' => text($count)]);
?>