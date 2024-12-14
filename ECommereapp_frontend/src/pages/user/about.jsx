import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";

function About() {
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: true,  // Animations only happen once
      offset: 50   // Trigger animations slightly earlier
    });
  }, []);

  const SectionCard = ({ title, children, className = "", dataAos = "" }) => (
    <div
      data-aos={dataAos}
      className={`bg-white rounded-3xl p-8 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl shadow-lg ${className}`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #ffe6f2 100%)",
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-pink-200 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>About Us | Mera Bestie</title>
        <meta name="description" content="Learn about Mera Bestie's journey, vision, and mission." />
      </Helmet>
      <Navbar />    
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                About Our Company
              </span>
              <span className="text-gray-800 block text-3xl mt-2">Empowering Connections, Inspiring Growth</span>
            </h1>
          </div>

          {/* About Sections */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* About Our Company Section */}
            <SectionCard 
              title="About Our Company" 
              dataAos="fade-right"
            >
              <p className="text-gray-600 mb-4 leading-relaxed">
                At Mera Bestie, we are more than just a company. We are a community dedicated to creating meaningful connections and providing exceptional experiences.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our journey is driven by passion, innovation, and a commitment to understanding and meeting the unique needs of our clients.
              </p>
            </SectionCard>

            {/* Why Choose Us Section */}
            <SectionCard 
              title="Why Choose Us?" 
              dataAos="fade-left"
            >
              <p className="text-gray-600 mb-4 leading-relaxed">
                We stand out through our personalized approach, cutting-edge solutions, and unwavering dedication to customer satisfaction.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team brings together diverse expertise, creative thinking, and a genuine passion for delivering excellence.
              </p>
            </SectionCard>

            {/* Objective Section */}
            <SectionCard 
              title="Objectives" 
              dataAos="fade-right"
              className="lg:col-span-2"
            >
              <ul className="text-gray-600 leading-relaxed list-disc list-inside space-y-2">
                <li>Drive innovation that transforms customer experiences</li>
                <li>Foster a culture of continuous learning and growth</li>
                <li>Create sustainable solutions that make a real difference</li>
                <li>Build long-lasting relationships based on trust and mutual respect</li>
                <li>Continuously push the boundaries of what's possible</li>
              </ul>
            </SectionCard>

            {/* Vision Section */}
            <SectionCard 
              title="Vision" 
              dataAos="fade-right"
            >
              <p className="text-gray-600 leading-relaxed">
                To be the leading platform that connects people, inspires innovation, and creates transformative experiences that empower individuals and businesses.
              </p>
            </SectionCard>

            {/* Mission Section */}
            <SectionCard 
              title="Mission" 
              dataAos="fade-left"
            >
              <p className="text-gray-600 leading-relaxed">
                Our mission is to leverage technology and human-centric design to solve complex challenges, create meaningful connections, and drive positive change in the world.
              </p>
            </SectionCard>
          </div>

          {/* Image Section */}
          <div className="mt-16 text-center">
            <img
              src="src/assets/bg shop.png"
              alt="Mera Bestie Team"
              className="rounded-2xl shadow-2xl mx-auto max-w-4xl h-auto transform transition duration-500 hover:scale-[1.01]"
            />
          </div>

          {/* Footer Text */}
          <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                Join Our Journey
              </span>
              <span className="text-gray-800 block text-2xl mt-2">Together, We Create Extraordinary Experiences</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Mera Bestie, every interaction is an opportunity to inspire, connect, and grow. We invite you to be part of our story.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;