<?php
include 'db.php';

$nama = $_POST['nama'];

$sql = "SELECT * FROM users WHERE nama = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nama);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $insert = $conn->prepare("INSERT INTO users (nama) VALUES (?)");
    $insert->bind_param("s", $nama);
    $insert->execute();
    $id = $conn->insert_id;
    $pesan = "Selamat datang trader sejati!";
} else {
    $row = $result->fetch_assoc();
    $id = $row['id'];
    $pesan = "Selamat datang kembali trader sejati!";
}

echo json_encode(["id" => $id, "nama" => $nama, "pesan" => $pesan]);