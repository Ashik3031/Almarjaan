import React, { useEffect, useRef } from 'react';

const aboutus = "https://res.cloudinary.com/dxq0nrirt/image/upload/v1763984905/IMG_8641-fine_ihxcgk.jpg";

const AboutUs = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-active');
          }
        });
      }, 
      { threshold: 0.1 }
    );  

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const products = [
    {
      name: "Noir Sublime",
      subtitle: "Eau de Parfum",
      notes: {
        top: "Saffron, Bergamot",
        heart: "Bulgarian Rose, Oud",
        base: "Amber, Patchouli, Vanilla"
      },
      description: "A captivating blend where precious oud meets delicate rose, wrapped in warm amber. Bold yet refined."
    },
    {
      name: "Lumière d'Or",
      subtitle: "Eau de Parfum",
      notes: {
        top: "Mandarin, Pink Pepper",
        heart: "Jasmine, Orange Blossom",
        base: "Sandalwood, White Musk, Vanilla"
      },
      description: "A luminous floral that captures the golden hour. Fresh citrus opens to creamy florals and warm woods."
    },
    {
      name: "Oud Impérial",
      subtitle: "Extrait de Parfum",
      notes: {
        top: "Frankincense, Cardamom",
        heart: "Cambodian Oud, Geranium",
        base: "Leather, Vetiver, Musk"
      },
      description: "Our most profound creation. Aged oud from Cambodia melds with sacred frankincense and leather."
    },
    {
      name: "Rose Mystique",
      subtitle: "Eau de Parfum",
      notes: {
        top: "Turkish Rose, Lychee",
        heart: "Peony, Magnolia",
        base: "Cedarwood, Musk"
      },
      description: "A modern interpretation of the timeless rose. Fruity sweetness balanced by fresh petals and woody depth."
    },
    {
      name: "Bois Précieux",
      subtitle: "Eau de Parfum",
      notes: {
        top: "Cypress, Lavender",
        heart: "Iris, Cashmere Wood",
        base: "Cedarwood, Amber, Tonka Bean"
      },
      description: "An elegant woody composition. Clean aromatics transition to soft iris and rich cedar."
    },
    {
      name: "Ambre Royal",
      subtitle: "Parfum",
      notes: {
        top: "Cinnamon, Nutmeg",
        heart: "Dates, Tuberose, Praline",
        base: "Amber, Oud, Vanilla"
      },
      description: "Opulent and warm. Sweet spices and gourmand heart rest on a luxurious base of amber and oud."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${aboutus})`,
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-light tracking-widest mb-6 uppercase">
            AL MARJAAN
          </h1>
          <div className="w-16 h-px bg-white mx-auto mb-6 opacity-70"></div>
          <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Where ancient traditions meet contemporary artistry
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section 
        ref={el => sectionsRef.current[0] = el}
        className="py-32 px-6 max-w-4xl mx-auto fade-in"
      >
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 tracking-wide">
            Our Story
          </h2>
          <div className="w-12 h-px bg-gray-400 mx-auto mb-12"></div>
        </div>
        
        <div className="space-y-8 text-gray-700 font-light leading-relaxed text-lg">
          <p>
            Founded in the heart of the UAE, AL MARJAAN draws its name from the precious coral—
            a symbol of natural beauty shaped by time and tide.
          </p>
          <p>
            Our master perfumers combine centuries of Arabian perfumery heritage with the precision 
            of French haute parfumerie. Each fragrance is a dialogue between East and West, 
            tradition and innovation.
          </p>
          <p>
            We source the finest raw materials from around the world: Bulgarian roses harvested at dawn, 
            Cambodian oud aged for decades, Italian bergamot kissed by Mediterranean sun. 
            These precious essences are transformed through ancient distillation techniques 
            and modern artistry into scents that speak to the soul.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section 
        ref={el => sectionsRef.current[1] = el}
        className="py-32 bg-gray-50 fade-in"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <h3 className="text-xl font-light mb-6 tracking-wide">Craftsmanship</h3>
              <div className="w-8 h-px bg-gray-400 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light leading-relaxed">
                Every fragrance undergoes 72 hours of maceration, 
                allowing notes to marry and mature into perfect harmony.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-light mb-6 tracking-wide">Ingredients</h3>
              <div className="w-8 h-px bg-gray-400 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light leading-relaxed">
                We maintain a library of over 200 rare essences, 
                each selected for its exceptional quality and character.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-light mb-6 tracking-wide">Artistry</h3>
              <div className="w-8 h-px bg-gray-400 mx-auto mb-6"></div>
              <p className="text-gray-600 font-light leading-relaxed">
                Our perfumers compose not with formulas, but with emotion, 
                creating olfactory memories that linger long after.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section 
        ref={el => sectionsRef.current[2] = el}
        className="py-32 px-6 fade-in"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 tracking-wide">
              Signature Creations
            </h2>
            <div className="w-12 h-px bg-gray-400 mx-auto mb-12"></div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
              Six fragrances that define our philosophy. Each a masterpiece of balance and depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product, index) => (
              <div 
                key={index}
                className="group"
              >
                <div className="border border-gray-200 p-8 hover:border-gray-400 transition-colors duration-500 h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-xl font-light mb-2 tracking-wide">{product.name}</h3>
                    <p className="text-sm text-gray-500 tracking-wider uppercase">{product.subtitle}</p>
                  </div>
                  
                  <div className="mb-6 flex-grow">
                    <p className="text-sm text-gray-700 font-light leading-relaxed mb-6">
                      {product.description}
                    </p>
                    
                    <div className="space-y-3 text-xs text-gray-600">
                      <div>
                        <span className="uppercase tracking-wider text-gray-500">Top:</span>
                        <span className="ml-2 font-light">{product.notes.top}</span>
                      </div>
                      <div>
                        <span className="uppercase tracking-wider text-gray-500">Heart:</span>
                        <span className="ml-2 font-light">{product.notes.heart}</span>
                      </div>
                      <div>
                        <span className="uppercase tracking-wider text-gray-500">Base:</span>
                        <span className="ml-2 font-light">{product.notes.base}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        ref={el => sectionsRef.current[3] = el}
        className="py-32 bg-gray-50 fade-in"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 tracking-wide">
            Visit Our Atelier
          </h2>
          <div className="w-12 h-px bg-gray-400 mx-auto mb-12"></div>
          
          <div className="space-y-6 text-gray-700 font-light leading-relaxed text-lg mb-16">
            <p>
              Experience our fragrances in person at our flagship boutique in the UAE. 
              Our consultants guide you through a personalized journey of discovery.
            </p>
            <p>
              For discerning clients, we offer bespoke fragrance creation—
              working directly with our master perfumers to craft a scent uniquely yours.
            </p>
          </div>

          <div className="pt-12 border-t border-gray-300">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">United Arab Emirates</p>
            <p className="text-gray-600 font-light">By appointment & walk-in welcome</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section 
        ref={el => sectionsRef.current[4] = el}
        className="py-32 px-6 fade-in"
      >
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-light italic text-gray-800 leading-relaxed mb-8">
            "A perfume is more than a scent—it is a memory waiting to be made, 
            an emotion captured in a single breath."
          </blockquote>
          <div className="w-12 h-px bg-gray-400 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Master Perfumer
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-light mb-4 tracking-widest">AL MARJAAN</h3>
          <p className="text-sm text-gray-400 uppercase tracking-widest">
            Excellence in Perfumery
          </p>
        </div>
      </footer>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default AboutUs;