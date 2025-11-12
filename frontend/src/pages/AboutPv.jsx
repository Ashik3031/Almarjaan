import React from "react";

const AboutSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-stretch w-full min-h-[500px]">
      {/* Left - Video */}
      <div className="w-full md:w-1/2 relative overflow-hidden">
        <video
          src="https://res.cloudinary.com/dugtxybef/video/upload/v1762855174/IMG_8518_ortqmi.mov" // replace with your video URL
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Right - Text */}
      <div className="w-full md:w-1/2 bg-[#f9f9f9] flex items-center justify-center text-center px-6 md:px-20 py-12">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gray-600 mb-4">
            About Al Marjaan
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-normal mb-6">
            CERAMIC EXPERTISE
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md mx-auto">
            Al Marjaan's signature ceramic designs highlight the expertise of skilled artisans from our partnered workshops in the UAE and abroad, blending tradition and innovation with every sculpted form.
          </p>
          <a
            href="/about-us"
            className="text-sm underline font-medium hover:text-black transition"
          >
            Find out more
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;