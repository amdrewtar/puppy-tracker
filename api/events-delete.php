<?php
// api/events-delete.php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/db.php"; // ⚠️ путь как у других api

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["id"])) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "error" => "Missing event id"
  ]);
  exit;
}

$id = (int)$input["id"];

try {
  $stmt = $pdo->prepare("
    DELETE FROM events
    WHERE id = :id
    LIMIT 1
  ");

  $stmt->execute([
    ":id" => $id
  ]);

  echo json_encode([
    "success" => true,
    "deleted_id" => $id
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "error" => $e->getMessage()
  ]);
}
