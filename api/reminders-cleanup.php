<?php
require "db.php";

// удаляем всё, что меньше сегодняшней даты
$stmt = $pdo->prepare("
  DELETE FROM reminders
  WHERE date < CURDATE()
");

$stmt->execute();

echo json_encode([
  "deleted" => $stmt->rowCount()
]);
