<?php
header("Content-Type: application/json");
require_once "../db.php";

$date = $_GET["date"] ?? null;

if (!$date) {
  http_response_code(400);
  echo json_encode(["error" => "Date is required"]);
  exit;
}

try {
  $stmt = $pdo->prepare("
    SELECT id, type, location, time, comment, date
    FROM events
    WHERE date = :date
    ORDER BY time DESC
  ");

  $stmt->execute([
    ":date" => $date
  ]);

  $events = $stmt->fetchAll();

  echo json_encode($events);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => "DB error"]);
}
