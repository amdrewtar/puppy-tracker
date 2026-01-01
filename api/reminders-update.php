<?php
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
  require "db.php";

  $data = json_decode(file_get_contents("php://input"), true);

  if (
    !$data ||
    empty($data["id"]) ||
    empty($data["title"]) ||
    empty($data["date"])
  ) {
    throw new Exception("Invalid data");
  }

  $stmt = $pdo->prepare("
    UPDATE reminders
    SET
      title = :title,
      date  = :date,
      time  = :time,
      note  = :note
    WHERE id = :id
  ");

  $stmt->execute([
    ":id"    => $data["id"],
    ":title" => $data["title"],
    ":date"  => $data["date"],
    ":time"  => $data["time"] ?? "00:00",
    ":note"  => $data["note"] ?? null,
  ]);

  echo json_encode([
    "success" => true
  ]);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}
