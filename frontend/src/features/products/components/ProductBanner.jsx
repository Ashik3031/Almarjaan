const ProductBanner = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-white px-6 md:px-12 mt-0">
      {/* Image */}
      <div className="w-full md:w-3/5 mb-8 md:mb-0">
        <div className="w-full h-[350px] md:h-[500px]">
          <img
            src="https://res.cloudinary.com/dsfgakhl4/image/upload/v1750756891/ChatGPT_Image_Jun_24_2025_01_18_25_PM_eabzoc.png"
            alt="The Scents of Summer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="w-full md:w-2/5 md:pl-16 px-6 md:px-12 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-serif font-light mb-6 tracking-wider">
          THE SCENTS OF SUMMER
        </h2>
        <p className="text-sm md:text-base text-gray-600 mb-8 leading-relaxed">
          Sun-drenched fig trees. Sparkling, ripe citrus fruits. Fresh and
          delicate flowers. The invigorating notes of a dream garden revealed
          in a selection of sunny fragrances.
        </p>
        <button className="px-8 py-3 border border-black text-sm tracking-wider hover:bg-black hover:text-white transition duration-300">
          DISCOVER THE SELECTION
        </button>
      </div>
    </section>
  );
}; 

export default ProductBanner;