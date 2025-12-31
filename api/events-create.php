<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid JSON"]);
  exit;
}

require_once __DIR__ . "/db.php";

$type     = $data['type'] ?? null;
$time     = $data['time'] ?? null;
$location = $data['location'] ?? 'home';
$comment  = $data['comment'] ?? '';

// ✅ НОВОЕ — дата приходит с фронта
$date     = $data['date'] ?? null;

if (!$type || !$time || !$date) {
  http_response_code(400);
  echo json_encode(["error" => "Missing required fields"]);
  exit;
}

// ❌ УБРАЛИ
// $date = date("Y-m-d");

$stmt = $pdo->prepare("
  INSERT INTO events (
    event_type,
    event_date,
    event_time,
    location_type,
    comment
  )
  VALUES (
    :type,
    :date,
    :time,
    :location,
    :comment
  )
");

$stmt->execute([
  ":type"     => $type,
  ":date"     => $date,      // ✅ теперь выбранный день
  ":time"     => $time,
  ":location" => $location,
  ":comment"  => $comment,
]);

echo json_encode([
  "success" => true,
  "id" => $pdo->lastInsertId()
]);
