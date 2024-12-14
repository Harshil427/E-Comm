import React from "react";
import {
  FaArrowLeft,
  FaClock,
  FaUsers,
  FaStar,
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const LearnMore = ({ course, onBack }) => {
  return (
    <>
      <Helmet>
        <title>{course.title} | Mera Bestie</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </motion.button>

          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Course Image Section */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md flex items-center">
                <FaStar className="text-yellow-400 mr-2" />
                <span className="font-semibold">{course.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Course Details Section */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  {course.title}
                </h1>
                <p className="text-gray-600 mb-6">{course.description}</p>

                {/* Course Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: FaClock, text: course.duration },
                    { icon: FaUsers, text: `${course.students} students enrolled` },
                    { icon: FaGraduationCap, text: course.level },
                    { icon: FaChalkboardTeacher, text: course.instructor }
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center">
                      <Icon className="text-blue-500 mr-2 text-lg" />
                      <span className="text-gray-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing and Enrollment */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="font-bold text-3xl text-blue-600">${course.price}</span>
                    <span className="text-gray-600 ml-2">
                      or ${course.monthlyPrice}/mo
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {course.totalReviews} total reviews
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Enroll Now
                </motion.button>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 grid md:grid-cols-2 gap-8"
          >
            {/* Course Overview */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                Course Overview
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {course.fullDescription}
              </p>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
              <h2 className="text-2xl font-semibold mb-4 text-purple-800">
                What You'll Learn
              </h2>
              <ul className="space-y-3">
                {course.fullDescription
                  .split("\n")
                  .filter((line) => line.trim().startsWith("-"))
                  .map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-center text-gray-700"
                    >
                      <FaCheckCircle className="text-green-500 mr-3" />
                      {item.trim().substring(1).trim()}
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LearnMore;