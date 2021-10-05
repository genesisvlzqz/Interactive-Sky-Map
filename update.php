<?php
//The following script creates and writes to a txt file containing the json data
$data = file_get_contents("https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,sy_pnum,ra,dec,st_teff,st_rad,sy_vmag,sy_dist,pl_orbsmax,pl_bmasse,pl_rade+from+pscomppars&format=json");
$dataFile = fopen("planet_data.txt", "w") or die("Unable to open file!");
fwrite($dataFile,$data);
fclose($dataFile);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    
    <title>Interactive SkyMap</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="images/favicon.ico" />
    <!-- Import css sheet -->
    <style type="text/css"> @import url(style.css); </style>
    <style type="text/css">@import url(style.css);</style>
</head>
<div id="header-container">
  <div id="header">
    <h1><a href="home">Interactive<span>Skymap</span></a></h1>
    <p id="slogan">Pre-loaded with https://exoplanetarchive.ipac.caltech.edu/</p>
  </div>
</div>
<body>
    <div id="content"> 
        <h2>Data updated succesfully</h1>
        <form action="/index.html" method="get">
            <input type="submit" value="Return to Map">
        </form> 
    </div>

</body>