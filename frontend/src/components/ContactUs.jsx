import React from 'react';
import { Phone, MapPin, Building2, Mail, Clock } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-wide">
            Contact
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-slate-200 font-light max-w-3xl mx-auto leading-relaxed">
            Crafting extraordinary fragrances that tell your story
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Company Introduction */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-8 tracking-wide">
            AL MARJAAN
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Master perfumers dedicated to creating exceptional olfactory experiences. 
            Each fragrance is meticulously crafted using the finest ingredients from around the world.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Phone */}
          <div className="group bg-white p-8 rounded-none shadow-sm hover:shadow-xl transition-all duration-500 border-l-4 border-slate-800">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6 group-hover:bg-slate-800 transition-colors duration-300">
              <Phone className="w-8 h-8 text-slate-800 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-light text-slate-800 mb-4 tracking-wide">TELEPHONE</h3>
            <div className="space-y-2">
              <p className="text-slate-600 hover:text-slate-800 transition-colors cursor-pointer">+971 042263026</p>
              <p className="text-slate-600 hover:text-slate-800 transition-colors cursor-pointer">+971 559189517</p>
            </div>
          </div>

          {/* Location */}
          <div className="group bg-white p-8 rounded-none shadow-sm hover:shadow-xl transition-all duration-500 border-l-4 border-slate-800">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6 group-hover:bg-slate-800 transition-colors duration-300">
              <MapPin className="w-8 h-8 text-slate-800 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-light text-slate-800 mb-4 tracking-wide">ADDRESS</h3>
            <div className="space-y-1">
              <p className="text-slate-600 leading-relaxed">Abu Hail</p>
              <p className="text-slate-600 leading-relaxed">Remote</p>
              <p className="text-slate-600 leading-relaxed">UAE</p>
            </div>
          </div>

          {/* Boutique Hours */}
          <div className="group bg-white p-8 rounded-none shadow-sm hover:shadow-xl transition-all duration-500 border-l-4 border-slate-800">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6 group-hover:bg-slate-800 transition-colors duration-300">
              <Clock className="w-8 h-8 text-slate-800 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-light text-slate-800 mb-4 tracking-wide">SHOP HOURS</h3>
            <div className="space-y-2">
              <p className="text-slate-600">Monday - Saturday</p>
              <p className="text-slate-600">10:00 AM - 8:00 PM</p>
              <p className="text-slate-600 text-sm">Sunday: 12:00 PM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Fragrance Collections Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-12 mb-20">
          <div className="text-center">
            <h3 className="text-3xl font-light text-white mb-8 tracking-wide">OUR COLLECTIONS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-white font-light text-lg mb-2">SIGNATURE</h4>
                <p className="text-slate-300 text-sm">Timeless fragrances for the discerning connoisseur</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-white font-light text-lg mb-2">ARTISAN</h4>
                <p className="text-slate-300 text-sm">Rare and exclusive limited edition creations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-white font-light text-lg mb-2">BESPOKE</h4>
                <p className="text-slate-300 text-sm">Personalized fragrances crafted just for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-light text-slate-800 mb-6 tracking-wide">
            Ready to Transform Your Space?
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Experience the difference of working with professionals who understand 
            that every detail matters in creating exceptional living and working environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-slate-800 text-white px-8 py-3 hover:bg-slate-900 transition-colors duration-300 font-light tracking-wide">
              SCHEDULE CONSULTATION
            </button>
            <button className="border border-slate-800 text-slate-800 px-8 py-3 hover:bg-slate-800 hover:text-white transition-all duration-300 font-light tracking-wide">
              VIEW PORTFOLIO
            </button>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="text-center mt-20 pt-12 border-t border-slate-200">
          <p className="text-2xl md:text-3xl font-light text-slate-800 tracking-wide">
            AL MARJAAN
          </p>
          <p className="text-slate-500 mt-2 font-light tracking-widest text-sm">
            BUILT FOR RELIABILITY
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;