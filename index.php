<?php

    require_once 'vendor/autoload.php';

    $loader = new Twig_Loader_Filesystem('app');
    $twig = new Twig_Environment($loader, array(
        'debug' => true
    ));

    $twig->addExtension(new Twig_Extension_Debug());

    function route() {
        $url = $_SERVER['REQUEST_URI'];
        $result = array();


        if (stristr($url, '?') != '') {
            $url = explode('?', $url)[0];

            $result = explode('/', $url);
            $result['params'] = $_GET;
        } else {
            $result = explode('/', $url);
        }
        return array_splice($result, 1);
    }

    function text() {
        if( $curl = curl_init() ) {
            curl_setopt($curl, CURLOPT_URL, 'https://fish-text.ru/get?type=paragraph&number=' . rand(10, 50));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
            $out = curl_exec($curl);
            curl_close($curl);
        }


        $res = json_decode($out, true);
        $res = explode('\n\n', $res['text']);
        $last = array_pop($res);
        return $res;
    }

    function getLinks() {
        $dir = 'app/pages/';

        $files = scandir($dir);

        $res = [];

        foreach ($files as $key => $value) {
            if ($value != '.' && $value != '..') {

                $item = str_replace('.html', '', $value);

                $nameArr = explode('_', $item);
                $name = '';

                if (count($nameArr) != 0) {
                    foreach ($nameArr as $key => $value) {
                        $name .= ucfirst($value) . ' ';
                    }
                } else {
                    $name = ucfirst($item);
                }

                $res[] = array(
                    'name' => $name,
                    'link' => $item
                );
            }
        }

        return $res;
    }


    $route = route();
    $data = array(
        'pagename' => $route[0],
        'nav_items' => getLinks(),
        'route' => $route[0]
    );

    if ($route[0] == 'sticky_header') {
        $data['data'] = array_chunk(text(), 5);
    }

    echo $twig->render('pages/'. $route[0] .'.html', $data);


?>