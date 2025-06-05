<?php
$host = "localhost"; // atau coba "mysql.hostinger.com" jika gagal
$user = "u862558704_trader";
$pass = "Fahtrade-97"; // ganti dengan password MySQL kamu
$db   = "u862558704_jurnal";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Koneksi ke database gagal: " . $conn->connect_error);
}
?>