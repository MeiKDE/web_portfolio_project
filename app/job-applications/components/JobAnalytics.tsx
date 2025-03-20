"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobAnalyticsProps {
  jobListings: any[];
}

export function JobAnalytics({ jobListings }: JobAnalyticsProps) {
  // Calculate metrics
  const totalJobs = jobListings.length;
  const appliedJobs = jobListings.filter(
    (job) => job.status !== "saved"
  ).length;
  const interviewJobs = jobListings.filter(
    (job) =>
      job.status === "phone-screening" ||
      job.status === "interview" ||
      job.status === "offer-received" ||
      job.status === "accepted"
  ).length;
  const offerJobs = jobListings.filter(
    (job) => job.status === "offer-received" || job.status === "accepted"
  ).length;

  const responseRate =
    appliedJobs > 0 ? (interviewJobs / appliedJobs) * 100 : 0;
  const interviewRate =
    appliedJobs > 0 ? (interviewJobs / appliedJobs) * 100 : 0;
  const offerRate = interviewJobs > 0 ? (offerJobs / interviewJobs) * 100 : 0;

  // Get top skills from job listings
  const skillsMap: Record<string, number> = {};
  jobListings.forEach((job) => {
    if (job.keySkills) {
      job.keySkills.forEach((skill: string) => {
        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
      });
    }
  });

  const topSkills = Object.entries(skillsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appliedJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{interviewJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{offerJobs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Response Rate</span>
                  <span className="text-sm font-medium">
                    {responseRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${responseRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Interview Rate</span>
                  <span className="text-sm font-medium">
                    {interviewRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${interviewRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Offer Rate</span>
                  <span className="text-sm font-medium">
                    {offerRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${offerRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Top Skills in Demand
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topSkills.length > 0 ? (
                    topSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skills data available yet
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-500 mt-0.5"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>
                      Highlight quantifiable achievements in your resume
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-500 mt-0.5"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Tailor your resume for each application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-500 mt-0.5"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>Include relevant keywords from job descriptions</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
