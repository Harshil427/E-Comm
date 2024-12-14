import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ecommerse-assingment-backend.onrender.com/post-complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'unregistered'
        })
      });

      const data = await response.json();

      if (response.ok && data.message === "Complaint registered successfully") {
        setShowSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        
        setTimeout(() => {
          setShowSuccess(false);
          window.location.href = '/contact';
        }, 3000);
      } else {
        console.error('Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <>
    <Helmet>
      <title>Contact Us | Mera Bestie</title>
      <meta name="description" content="Get in touch with Mera Bestie. We're here to help and answer any questions you may have." />
    </Helmet>
    <Navbar className='z-0 mb-auto' />
    <div className="bg-gradient-to-br from-pink-50 to-blue-50 min-h-screen">
      
      <div className="container mx-auto px-4 py-16">
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
          >
            <motion.div 
              className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-32 h-32 mx-auto mb-6 text-green-500"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                    d="M20 6L9 17l-5-5"
                  />
                </svg>
              </motion.div>
              <h3 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h3>
              <p className="text-gray-700 mb-2">Your message has been received.</p>
              <p className="text-gray-600 text-sm">We'll get back to you soon.</p>
            </motion.div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help and answer any questions you may have. 
            Reach out and let's start a conversation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <FaPaperPlane className="text-pink-500 mr-4 text-3xl" />
              <h2 className="text-3xl font-bold text-gray-800">Send a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-pink-500 mr-4 text-3xl" />
                <h2 className="text-3xl font-bold text-gray-800">Our Location</h2>
              </div>
              <div className="space-y-6 mb-8">
                {[
                  { 
                    icon: <FaPhone className="text-pink-500 text-2xl" />, 
                    title: "Phone", 
                    detail: "+1 (555) 123-4567" 
                  },
                  { 
                    icon: <FaEnvelope className="text-pink-500 text-2xl" />, 
                    title: "Email", 
                    detail: "support@merabestie.com" 
                  },
                  { 
                    icon: <FaMapMarkerAlt className="text-pink-500 text-2xl" />, 
                    title: "Address", 
                    detail: "123 Gift Street, Creative Quarter, NY 10001" 
                  }
                ].map((contact, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-4 bg-pink-50 p-4 rounded-xl"
                  >
                    <div className="p-3 bg-white rounded-full shadow-md">
                      {contact.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{contact.title}</h3>
                      <p className="text-gray-600">{contact.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.982135436!2d-73.98823922400567!3d40.748817671411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1698352689255!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="w-full"
              ></iframe>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Let's Create Something Amazing Together
          </h2>
          <p className="text-xl text-gray-600">
            Whether you have a question, feedback, or just want to say hello, 
            we're always excited to hear from you. Your thoughts matter to us.
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default ContactUs;