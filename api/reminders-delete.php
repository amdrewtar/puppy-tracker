<?php
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
  http_response_code(400);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM reminders WHERE id = ?");
$stmt->execute([$data['id']]);

echo json_encode(["success" => true]);
