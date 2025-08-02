import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import { Particles } from "../components/Particles";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const titleRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(titleRef, { once: false, margin: "-100px" });

  // Auto-play video when section comes into view
  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, [isInView]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("From submitted:", formData);
      await emailjs.send(
        "service_zqqhxzg",
        "template_irg66ac",
        {
          from_name: formData.name,
          to_name: "Arpon",
          from_email: formData.email,
          to_email: "arpon3094@gmail.com",
          message: formData.message,
        },
        "fiWJaSpUeBQNg1EtT"
      );
      setIsLoading(false);
      setFormData({ name: "", email: "", message: "" });
      showAlertMessage("success", "You message has been sent!");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showAlertMessage("danger", "Somthing went wrong!");
    }
  };
  return (
    <section className="relative flex flex-col items-center c-space section-spacing">
      <Particles
        className="absolute inset-0 -z-50"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh
      />
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      
      {/* Stunning Title */}
      <motion.div 
        ref={titleRef}
        className="relative z-10 text-center mb-16"
      >
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Get in Touch
          </span>
          
          {/* Glowing Shadow */}
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent blur-lg opacity-50">
            Get in Touch
          </span>
        </motion.h2>
        
        {/* Animated Divider */}
        <motion.div 
          className="flex justify-center items-center space-x-4 mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
        </motion.div>
      </motion.div>

      {/* Two Column Layout - Equal Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full px-4 items-stretch">
        
        {/* Left Section - Contact Form */}
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="w-full p-6 border border-white/10 rounded-2xl bg-primary backdrop-blur-sm h-full flex flex-col justify-center">
            <div className="flex flex-col items-start w-full gap-5 mb-8">
              <h2 className="text-heading text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Let's Talk
              </h2>
              <p className="font-normal text-neutral-400 leading-relaxed">
                Whether you're looking to build a new website, improve your existing
                platform, or bring a unique project to life, I'm here to help
              </p>
            </div>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="feild-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="field-input field-input-focus"
                  placeholder="John Doe"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="feild-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="field-input field-input-focus"
                  placeholder="JohnDoe@email.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="message" className="feild-label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  rows="4"
                  className="field-input field-input-focus"
                  placeholder="Share your thoughts..."
                  autoComplete="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-1 py-3 text-lg text-center rounded-md cursor-pointer bg-radial from-lavender to-royal hover-animation"
              >
                {!isLoading ? "Send Message" : "Sending..."}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section - Video */}
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="w-full h-full flex flex-col justify-center">
            <div className="relative">
              {/* Video Container */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
                <div className="relative rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm">
                  <video
                    ref={videoRef}
                    className="w-full h-auto rounded-xl"
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source src="/assets/myself.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
            
            {/* Video Description */}
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Meet Arpon
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Get to know me better through this personal introduction. 
                Let's connect and create something amazing together!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
