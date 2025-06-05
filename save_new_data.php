<?php
include 'db.php';

$user_id = $_POST['user_id'];
$bulan   = $_POST['bulan'];
$modal   = str_replace(["Rp", ".", " "], "", $_POST['modal']);

$sql = "INSERT INTO modal (user_id, bulan, modal) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isi", $user_id, $bulan, $modal);
$stmt->execute();

echo "Berhasil";