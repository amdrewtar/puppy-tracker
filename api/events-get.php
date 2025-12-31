<?php
// api/events-get.php

header("Content-Type: application/json");

require_once __DIR__ . "/db.php";

// читаем JSON из body
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["date"])) {
  http_response_code(400);
  echo json_encode(["error" => "Missing date"]);
  exit;
}

$date = $input["date"];

try {
  // 🔧 ИЗМЕНЕНО: явный select нужных полей
  $stmt = $pdo->prepare("
    SELECT
      id,
      event_type,
      event_date,
      event_time,
      location_type,
      comment
    FROM events
    WHERE event_date = :date
    ORDER BY event_time DESC
  ");

  $stmt->execute([
    ":date" => $date
  ]);

  $events = $stmt->fetchAll();

  // 🔥 ДОБАВЛЕНО: нормализация данных под фронт
  $normalized = array_map(function ($row) {
    return [
      "id" => $row["id"],
      "type" => $row["event_type"],              // pee / poop / eat
      "time" => substr($row["event_time"], 0, 5),// HH:MM
      "location" => $row["location_type"],       // home / street
      "comment" => $row["comment"],
      "date" => $row["event_date"],
    ];
  }, $events);

  echo json_encode($normalized);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    "error" => "DB error",
    "details" => $e->getMessage()
  ]);
}
