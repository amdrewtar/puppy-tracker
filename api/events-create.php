<?php
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
  $data = json_decode(file_get_contents("php://input"), true);

  if (!$data) {
    throw new Exception("Invalid JSON input");
  }

  require_once __DIR__ . "/db.php";

  $type    = $data['type'] ?? null;
  $time    = $data['time'] ?? null;
  $date    = $data['date'] ?? null;
  $comment = $data['comment'] ?? '';
  $grams   = $data['grams'] ?? null;

  $location = ($type !== 'eat')
    ? ($data['location'] ?? 'home')
    : null;

  if (!$type || !$time || !$date) {
    throw new Exception("Missing required fields");
  }

  $stmt = $pdo->prepare("
    INSERT INTO events
      (event_type, event_date, event_time, location_type, comment, grams)
    VALUES
      (:type, :date, :time, :location, :comment, :grams)
  ");

  $stmt->execute([
    ":type"     => $type,
    ":date"     => $date,
    ":time"     => $time,
    ":location" => $location,
    ":comment"  => $comment,
    ":grams"    => $grams,
  ]);

  echo json_encode([
    "success" => true,
    "id" => $pdo->lastInsertId()
  ]);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}
