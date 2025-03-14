import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Job roles for typing effect
const jobRoles = ["Developer", "Designer", "Marketer", "Manager", "Engineer"];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [jobIndex, setJobIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Typing effect logic
  useEffect(() => {
    let currentJob = jobRoles[jobIndex] + " Job";
    let index = 0;
    let typingInterval = setInterval(() => {
      setText(currentJob.slice(0, index));
      index++;
      if (index > currentJob.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setJobIndex((prev) => (prev + 1) % jobRoles.length);
        }, 1000);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, [jobIndex]);

  // Search job function
  const searchJobHandler = () => {
    if (query.trim() !== "") {
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    }
  };

  return (
    <div
      className="relative h-screen flex flex-col justify-center items-center text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1E1E2E, #6A38C2, #F83002)",
      }}
    >
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <span className="px-5 py-2 rounded-full bg-white bg-opacity-20 text-white font-semibold text-sm shadow-md backdrop-blur-lg">
          🚀 Your Career Starts Here
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mt-6">
          Find Your <span className="text-yellow-300">{text}</span>
          <span className="inline-block w-3 h-8 bg-white ml-1 animate-blink"></span>
          <br /> In Just One Search!
        </h1>

        <p className="text-lg text-gray-300 mt-4">
          The right job isn't just about where you work—it’s about where you're
          heading.
        </p>
      </motion.div>
      {/* Search Bar (Static) */}
      <div className="mt-8 flex w-full sm:w-[60%] bg-white bg-opacity-10 backdrop-blur-md shadow-lg border border-white border-opacity-30 pl-4 pr-2 py-3 rounded-full items-center gap-3 mx-auto">
        <input
          type="text"
          placeholder="Find your dream job..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-white placeholder-white outline-none bg-transparent text-lg"
        />
        <Button
          onClick={searchJobHandler}
          className="rounded-full bg-yellow-300 hover:bg-yellow-400 transition-all px-5 py-2 text-black font-bold"
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
