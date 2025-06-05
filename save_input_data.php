<?php
include 'db.php';

$user_id = $_POST['user_id'];
$tanggal = $_POST['tanggal'];
$bulan   = $_POST['bulan'];
$profit  = str_replace(["Rp", ".", " "], "", $_POST['profit']);
$lot     = $_POST['open_lot'] ?: null;

$sql = "INSERT INTO trading_data (user_id, tanggal, bulan, profit, open_lot) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issid", $user_id, $tanggal, $bulan, $profit, $lot);
$stmt->execute();

echo "Berhasil";