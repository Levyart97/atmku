<?php
include 'db.php';

$user_id = $_POST['user_id'];
$conn->query("DELETE FROM trading_data WHERE user_id=$user_id");
$conn->query("DELETE FROM modal WHERE user_id=$user_id");

echo "Data berhasil direset";