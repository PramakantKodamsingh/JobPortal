import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white shadow-lg rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-extrabold text-2xl text-gray-900">
            {singleJob?.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-blue-100 text-blue-700 px-3 py-1 font-semibold">
              {singleJob?.postion} Positions
            </Badge>
            <Badge className="bg-red-100 text-red-600 px-3 py-1 font-semibold">
              {singleJob?.jobType}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 px-3 py-1 font-semibold">
              {singleJob?.salary} LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`px-6 py-2 text-white font-bold rounded-lg transition-all ${
            isApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="text-lg font-semibold border-b-2 border-gray-200 pb-3">
        Job Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h1 className="font-semibold text-gray-700">Role</h1>
          <p className="text-gray-900">{singleJob?.title}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h1 className="font-semibold text-gray-700">Location</h1>
          <p className="text-gray-900">{singleJob?.location}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h1 className="font-semibold text-gray-700">Experience</h1>
          <p className="text-gray-900">{singleJob?.experienceLevel} yrs</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h1 className="font-semibold text-gray-700">Salary</h1>
          <p className="text-gray-900">{singleJob?.salary} LPA</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h1 className="font-semibold text-gray-700">Total Applicants</h1>
          <p className="text-gray-900">{singleJob?.applications?.length}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h1 className="font-semibold text-gray-700">Posted Date</h1>
          <p className="text-gray-900">{singleJob?.createdAt.split("T")[0]}</p>
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-lg font-semibold">Job Description</h1>
        <p className="text-gray-800 mt-2 leading-relaxed">
          {singleJob?.description}
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
