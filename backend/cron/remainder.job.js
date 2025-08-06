import cron from "node-cron";
import Task from "../models/task.model.js";
import sendEmail from "../utils/sendMail.js";

export const startReminderJob = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log(" Running daily at 9:00 AM");

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const tasks = await Task.find({
        dueDate: { $lte: next24Hours, $gte: now },
        status: "pending",
        assignedTo: { $ne: null },
      }).populate("assignedTo");

      for (const task of tasks) {
        const user = task.assignedTo;

        if (user && user.email) {
          await sendEmail({
            to: user.email,
            subject: "Task Due Reminder",
            text: `Reminder: Your task "${task.title}" is due by ${task.dueDate.toLocaleString()}.`,
          });
          console.log(`Reminder sent to ${user.email}`);
        }
      }
    } catch (err) {
      console.error( err.message);
    }
  });
};
