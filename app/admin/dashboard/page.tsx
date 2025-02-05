import TeachersChart from "../../../components/charts/teachers-chart";
import ActivityChart from "../../../components/charts/activity-chart";
import { UsersChart } from "../../../components/charts/users-chart";
import { getActivityStatistics, getTeacherStatistics, getUserStatistics } from "@/lib/controllers/adminController";

export default async function AdminDashboardPage() {
  const teachersData = await getTeacherStatistics();
  const usersData = await getUserStatistics();
  const activityData = await getActivityStatistics();

  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      <TeachersChart data={teachersData}></TeachersChart>
      <UsersChart data={usersData}></UsersChart>
      <ActivityChart data={activityData.data} period={activityData.period} className="col-span-2"></ActivityChart>
    </div>
  )
}
