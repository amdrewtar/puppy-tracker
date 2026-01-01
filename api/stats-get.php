<?php
header("Content-Type: application/json");
require_once __DIR__ . "/db.php";

$input = json_decode(file_get_contents("php://input"), true);
$period = $input["period"] ?? "Today";

/**
 * --------------------------------------------------
 * DATE RANGE
 * --------------------------------------------------
 */
$today = new DateTime("today");

switch ($period) {
  case "Last 7 days":
    $from = (clone $today)->modify("-6 days");
    break;

  case "All Time":
    $from = null;
    break;

  default: // Today
    $from = $today;
}

$where = [];
$params = [];

if ($from) {
  $where[] = "event_date >= ?";
  $params[] = $from->format("Y-m-d");
}

$sql = "
  SELECT event_type, event_date, event_time, location_type, grams
  FROM events
";

if ($where) {
  $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " ORDER BY event_date ASC, event_time ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

/**
 * --------------------------------------------------
 * GROUP RAW DATA
 * --------------------------------------------------
 */
$events = [];

foreach ($rows as $row) {
  $type = $row["event_type"];
  $date = $row["event_date"];

  if (!isset($events[$type])) {
    $events[$type] = [
      "days" => [],
      "locations" => ["home" => 0, "street" => 0],
      "grams" => 0,
      "total" => 0,
    ];
  }

  if (!isset($events[$type]["days"][$date])) {
    $events[$type]["days"][$date] = [];
  }

  $events[$type]["days"][$date][] = $row["event_time"];
  $events[$type]["total"]++;

  if ($row["location_type"]) {
    $events[$type]["locations"][$row["location_type"]] =
      ($events[$type]["locations"][$row["location_type"]] ?? 0) + 1;
  }

  if ($type === "eat" && $row["grams"]) {
    $events[$type]["grams"] += (int)$row["grams"];
  }
}

/**
 * --------------------------------------------------
 * HELPERS
 * --------------------------------------------------
 */
function timeToMinutes(string $time): int {
  [$h, $m] = explode(":", $time);
  return ((int)$h) * 60 + (int)$m;
}

function minutesToTime(int $min): string {
  $h = floor($min / 60);
  $m = $min % 60;
  return sprintf("%02d:%02d", $h, $m);
}

function avgTime(array $times): string {
  $sum = 0;
  foreach ($times as $t) {
    $sum += timeToMinutes($t);
  }
  return minutesToTime((int)round($sum / count($times)));
}

/**
 * --------------------------------------------------
 * BUILD RESULT
 * --------------------------------------------------
 */
$result = [];

foreach ($events as $type => $info) {
  $daysCount = count($info["days"]);
  $total = $info["total"];

  $average = $daysCount
    ? (int)round($total / $daysCount)
    : 0;

  /**
   * ----------------------------------------------
   * COLLECT TIMES BY INDEX
   * ----------------------------------------------
   */
  $byIndex = [];
  $allTimes = [];

  foreach ($info["days"] as $dayTimes) {
    sort($dayTimes);

    foreach ($dayTimes as $i => $t) {
      $byIndex[$i][] = $t;
      $allTimes[] = $t;
    }
  }

  sort($allTimes);

  /**
   * ----------------------------------------------
   * BUILD times_day (STRICT = average)
   * ----------------------------------------------
   */
  $times_day = [];

  for ($i = 0; $i < $average; $i++) {
    if (!empty($byIndex[$i])) {
      $times_day[] = avgTime($byIndex[$i]);
    } elseif (!empty($allTimes)) {
      // fallback — усреднение по всем
      $times_day[] = avgTime($allTimes);
    }
  }

  sort($times_day);

  $times_day = array_combine(
    range(1, count($times_day)),
    $times_day
  );

  /**
   * ----------------------------------------------
   * FINAL STRUCTURE
   * ----------------------------------------------
   */
  $item = [
    "total" => $total,
    "average" => $period === "Today" ? $total : $average,
    "times_day" => $times_day,
  ];

  if ($type === "eat") {
    $item["weight_kg"] = round($info["grams"] / 1000, 2);
  } else {
    $item["locations"] = $info["locations"];
  }

  $result[$type] = $item;
}

/**
 * --------------------------------------------------
 * RESPONSE
 * --------------------------------------------------
 */
echo json_encode([
  "timestamp" => strtolower($period),
  "result" => $result,
], JSON_PRETTY_PRINT);
