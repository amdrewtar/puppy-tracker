<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["title"]) || empty($data["date"])) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid data"]);
  exit;
}

$stmt = $pdo->prepare("
  INSERT INTO reminders (id, title, date, time, note, created_at)
  VALUES (:id, :title, :date, :time, :note, :created_at)
");

$stmt->execute([
  ":id" => $data["id"],
  ":title" => $data["title"],
  ":date" => $data["date"],
  ":time" => $data["time"] ?? "00:00",
  ":note" => $data["note"] ?? null, // ✅ теперь придёт
  ":created_at" => date("Y-m-d H:i:s"),
]);

echo json_encode(["success" => true]);
