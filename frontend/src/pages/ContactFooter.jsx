export default function HelpCenter() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Contact Information Section */}
          <div className="flex flex-col justify-center px-4 sm:px-6 py-8">
            <h1 className="text-3xl sm:text-4xl font-serif mb-3 text-gray-900">
              NEED HELP?
            </h1>
            
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              We are here to assist you with all your inquiries
            </p>
            
            <div className="space-y-5 text-gray-600">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <a href="tel:042263026" className="text-gray-900 hover:text-gray-700 transition-colors text-lg">(04) 226 3026</a>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:lip@loveinparis.ae" className="text-gray-900 hover:text-gray-700 transition-colors">lip@loveinparis.ae</a>
              </div>
            </div>
            
            <a 
              href="https://www.google.com/maps/place/Love+in+Paris+perfumes+llc/@25.272256,55.2974909,17z/data=!4m14!1m7!3m6!1s0x3e5f43444ecbf86b:0x129d9b0abe049112!2sLove+in+Paris+perfumes+llc!8m2!3d25.2722512!4d55.3000658!16s%2Fg%2F11bv1c32s8!3m5!1s0x3e5f43444ecbf86b:0x129d9b0abe049112!8m2!3d25.2722512!4d55.3000658!16s%2Fg%2F11bv1c32s8?hl=en-US&entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 underline hover:text-gray-900 transition-colors mt-8 text-sm inline-block"
            >
              View on Google Maps →
            </a>
          </div>
          
          {/* Map Section */}
          <div className="w-full h-64 sm:h-80 md:h-full md:min-h-[320px] bg-gray-200 rounded overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.404773935839!2d55.2974909!3d25.272256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43444ecbf86b%3A0x129d9b0abe049112!2sLove%20in%20Paris%20perfumes%20llc!5e0!3m2!1sen!2sae!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Love in Paris Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}