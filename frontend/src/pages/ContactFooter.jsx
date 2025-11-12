
export default function HelpCenter() {
  return (
    <div className=" bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-serif mb-4 text-gray-900">
          NEED HELP?
        </h1>
        
        <p className="text-gray-600 mb-8">
          We are here to assist you
        </p>
        
        <button className="border-2 border-black px-8 py-3 mb-8 hover:bg-black hover:text-white transition-colors duration-200">
          CONTACT US
        </button>
        
        <div className="space-y-2 text-gray-600 mb-8">
          <p>+1 (833) 798-0845</p>
          <p>Monday - Friday: 10 am to 6 pm EST</p>
          <p>Excluding public holidays</p>
        </div>
        
        <a 
          href="#" 
          className="text-gray-700 underline hover:text-gray-900"
        >
          Help Center
        </a>
      </div>
    </div>
  );
}