<?php
include 'db.php';

$user_id = $_GET['user_id'];
$data = [
    "monthly_profit" => [],
    "average_lot" => [],
    "trend" => []
];

$months = $conn->query("SELECT DISTINCT bulan FROM trading_data WHERE user_id=$user_id");
while ($m = $months->fetch_assoc()) {
    $bulan = $m['bulan'];
    $query = $conn->query("SELECT SUM(profit) AS profit, AVG(open_lot) AS avg_lot FROM trading_data WHERE user_id=$user_id AND bulan='$bulan'");
    $res = $query->fetch_assoc();

    $data["monthly_profit"][$bulan] = $res['profit'];
    $data["average_lot"][$bulan] = $res['avg_lot'];
    $data["trend"][] = [
        "bulan" => $bulan,
        "profit" => $res['profit'],
        "lot" => $res['avg_lot']
    ];
}

echo json_encode($data);