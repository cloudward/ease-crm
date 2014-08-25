<?php

// this script handles requests to EASE Web Apps
require_once('ease/core.class.php');
$ease_core = new ease_core();
$ease_core->handle_request();

?>