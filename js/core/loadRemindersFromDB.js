import state from "./State.js";

export async function loadRemindersFromDB() {
  console.log("🧹 Cleaning past reminders...");
  await fetch("/api/reminders-cleanup.php");

  console.log("🌐 GET /api/reminders-list.php");
  const res = await fetch("/api/reminders-list.php");
  const data = await res.json();

  console.log("📥 DB reminders:", data);

  state.setReminders(
    data.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date,
      time: r.time || "00:00",
      comment: r.note || "",
      dateLabel: new Date(r.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }))
  );
}
