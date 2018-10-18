<?php

/**
 * @Author: Steven Thijs
 * @Date:   2018-08-16 18:00:21
 * @Last Modified by:   steven
 * @Last Modified time: 2018-10-09 01:11:01
 */

// path & query

	$url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$url = parse_url($url);

	
	$url_path = isset($url['path']) && !empty($url['path']) ? strtolower($url['path']) : '';
	$url_path = trim($url_path,'/');
	$url_path = !empty($url_path) ? explode('/',$url_path) : array('home');

	$url_query = isset($url['query']) && !empty($url['query']) ? strtolower($url['query']) : '';
	$url_query = parse_str($url_query);

// include

    function checkfile($v) {

    	if($v == "error") {
    		header('HTTP/1.1 404 Not Found');
    	}

        $path = './app/05_buckets/' . $v . '/' . $v . '.php';
        return file_exists($path) ? $path : false;

    }

    $include = isset($url_path[3]) ? checkfile($url_path[3]) : false;
    $include = isset($url_path[2]) && !$include ? checkfile($url_path[2]) : $include;
    $include = isset($url_path[1]) && !$include ? checkfile($url_path[1]) : $include;
    $include = isset($url_path[0]) && !$include ? checkfile($url_path[0]) : $include;
    $include = !$include ? checkfile('error') : $include;

// url

    define('_URL', $url["scheme"] . "://" . $url["host"]);

?>
<!doctype html>
<html lang="en">
<head>

	<base href="/">

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
	<meta name="msapplication-config" content="assets/graphics/browserconfig.xml">
	<meta name="theme-color" content="#ffffff">
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="author" content="">

	<meta property="og:title" content="">
	<meta property="og:site_name" content="">
	<meta property="og:description" content="">
	<meta property="og:type" content="website">
	<meta property="og:image" content="">
	<meta property="og:url" content="">

	<meta property="twitter:card" content="summary">
	<meta property="twitter:title" content="">
	<meta property="twitter:description" content="">
	<meta property="twitter:image" content="">
	<meta property="twitter:url" content="">

	<title>NULS</title>

	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo _URL; ?>/assets/graphics/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="<?php echo _URL; ?>/assets/graphics/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="<?php echo _URL; ?>/assets/graphics/favicon-16x16.png">
	<link rel="manifest" href="<?php echo _URL; ?>/assets/graphics/manifest.json">
	<link rel="mask-icon" href="<?php echo _URL; ?>/assets/svg/safari-pinned-tab.svg" color="#ffffff">
	<link rel="shortcut icon" href="<?php echo _URL; ?>/assets/graphics/favicon.ico">
	<link rel="stylesheet" href="<?php echo _URL; ?>/assets/styles/main.css">

	<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-000000000-0', 'auto'); ga('send', 'pageview');</script>

</head>
<body>

	<?php include $include; ?>
	
	<script src="<?php echo _URL; ?>/assets/scripts/main.js"></script>

</body>
</html>