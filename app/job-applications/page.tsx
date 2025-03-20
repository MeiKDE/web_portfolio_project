import { JobDashboard } from "@/app/job-applications/components/JobDashboard";
import { getJobListings } from "@/lib/job-data";
import { getUserData } from "@/lib/user-data";

export default async function JobsPage() {
  // Fetch user data and job listings
  const userData = await getUserData();
  const jobListings = await getJobListings();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
      <JobDashboard userData={userData} initialJobListings={jobListings} />
    </div>
  );
}
