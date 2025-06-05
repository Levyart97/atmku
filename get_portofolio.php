<?php
include 'db.php';

$user_id = $_GET['user_id'];
$bulan = $_GET['bulan'];

$modal_query = $conn->query("SELECT modal FROM modal WHERE user_id=$user_id AND bulan='$bulan'");
$modal_row = $modal_query->fetch_assoc();
$modal = $modal_row ? $modal_row['modal'] : 0;

$data = [];
$totalProfit = 0;
$result = $conn->query("SELECT * FROM trading_data WHERE user_id=$user_id AND bulan='$bulan'");
$no = 1;
while ($row = $result->fetch_assoc()) {
    $profit = $row['profit'];
    $persen = $modal > 0 ? round(($profit / $modal) * 100, 2) : 0;
    $totalProfit += $profit;
    $data[] = [
        "no" => $no++,
        "tanggal" => $row['tanggal'],
        "profit" => $profit,
        "persentase" => $persen,
        "lot" => $row['open_lot'],
        "total" => $totalProfit
    ];
}

echo json_encode([
    "modal" => $modal,
    "data" => $data,
    "total_profit" => $totalProfit
]);