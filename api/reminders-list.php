<?php
require "db.php";

$stmt = $pdo->query("
  SELECT
    id,
    title,
    DATE_FORMAT(date, '%Y-%m-%d') AS date,
    TIME_FORMAT(time, '%H:%i') AS time,
    note,
    created_at
  FROM reminders
  ORDER BY date ASC, time ASC
");

$reminders = $stmt->fetchAll();

echo json_encode($reminders);
