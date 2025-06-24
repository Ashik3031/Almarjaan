import React, { useEffect, useRef } from 'react';
const aboutus = "https://res.cloudinary.com/dsfgakhl4/image/upload/v1750488653/perfume-bottle-nature_2_a7cyha.jpg";

const AboutUs = () => {
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Parallax effect for hero section
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = heroRef.current;
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      }, 
      { threshold: 0.1 }
    );  

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-[#f8f6f0] min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        <div 
          ref={heroRef}
          className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] via-[#1a1a1a] to-black"
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <div className="max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8 opacity-0 animate-slide-up">
                AL MARJAAN
              </h1>
              <div className="w-24 h-px bg-white mx-auto mb-8 opacity-0 animate-slide-up" style={{animationDelay: '0.5s'}}></div>
              <p className="text-xl md:text-2xl font-light tracking-wide opacity-0 animate-slide-up" style={{animationDelay: '1s'}}>
                Art of Perfumes — The Art of Fragrance
              </p>
              <p className="text-lg md:text-xl font-extralight mt-4 opacity-0 animate-slide-up" style={{animationDelay: '1.5s'}}>
                Luxury Perfumes Crafted in the Heart of the UAE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <section 
        ref={el => sectionsRef.current[0] = el}
        className="py-24 px-4 sm:px-6 lg:px-8 opacity-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] mb-6">
              Notre Histoire
            </h2>
            <div className="w-16 h-px bg-[#d4af37] mx-auto mb-8"></div>
            <p className="text-xl text-[#666] font-light max-w-3xl mx-auto leading-relaxed">
              Born from the ancient traditions of Arabian perfumery and the modern sophistication of 
              contemporary fragrance artistry, AL MARJAAN represents the pinnacle of olfactory excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="prose prose-lg text-[#555] font-light leading-relaxed">
                <p>
                  Like the precious coral from which we take our name, AL MARJAAN embodies 
                  both the treasures of the deep and the artistry of time. Our master perfumers 
                  blend centuries-old Arabian heritage with contemporary French techniques.
                </p>
                <p>
                  Each fragrance tells a story — of desert winds carrying whispers of oud, 
                  of rose gardens blooming under starlit skies, of spice markets alive with 
                  the essence of distant lands. We capture these moments in crystal bottles.
                </p>
                <p>
                  From our atelier in the UAE, where East meets West in perfect harmony, 
                  we create scents that transcend boundaries and awaken the deepest emotions.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-[#2c2c2c] rounded-full p-8 shadow-2xl">
                <img
                  src={aboutus} 
                  alt="AL MARJAAN Perfume Atelier"
                  className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#d4af37] rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-[#d4af37] rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section 
        ref={el => sectionsRef.current[1] = el}
        className="py-24 bg-white opacity-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] mb-6">
              Nos Collections
            </h2>
            <div className="w-16 h-px bg-[#d4af37] mx-auto mb-8"></div>
            <p className="text-xl text-[#666] font-light max-w-3xl mx-auto">
              Three distinct olfactory journeys, each crafted with uncompromising artistry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Héritage",
                subtitle: "Arabian Legacy",
                description: "Our signature collection celebrates the timeless beauty of traditional Arabian perfumery. Rich oud, precious rose, and exotic spices dance together in perfect harmony.",
                icon: "🌹"
              },
              {
                title: "Modernité",
                subtitle: "Contemporary Elegance", 
                description: "Where innovation meets tradition. Fresh, sophisticated compositions that speak to the modern soul while honoring our deep-rooted heritage.",
                icon: "✨"
              },
              {
                title: "Prestige",
                subtitle: "Haute Parfumerie",
                description: "Our most exclusive creations, crafted with the rarest ingredients from around the world. Limited editions that represent the absolute pinnacle of our art.",
                icon: "💎"
              }
            ].map((collection, index) => (
              <div 
                key={index}
                className="group relative bg-[#f8f6f0] p-8 hover:bg-white transition-all duration-500 hover:shadow-2xl border border-transparent hover:border-[#d4af37]"
              >
                <div className="text-center">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {collection.icon}
                  </div>
                  <h3 className="text-2xl font-light text-[#2c2c2c] mb-2">
                    {collection.title}
                  </h3>
                  <div className="w-8 h-px bg-[#d4af37] mx-auto mb-4"></div>
                  <p className="text-sm text-[#d4af37] font-medium mb-4 tracking-wider uppercase">
                    {collection.subtitle}
                  </p>
                  <p className="text-[#666] font-light leading-relaxed">
                    {collection.description}
                  </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section 
        ref={el => sectionsRef.current[2] = el}
        className="py-24 bg-[#2c2c2c] text-white opacity-0"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-8">
                Art of Creation
              </h2>
              <div className="w-16 h-px bg-[#d4af37] mb-8"></div>
              <div className="space-y-6 text-[#ccc] font-light leading-relaxed">
                <p className="text-lg">
                  Every AL MARJAAN fragrance begins with a story, an emotion, a memory waiting to be captured.
                </p>
                <p>
                  Our master perfumers source the finest raw materials from around the globe — 
                  Bulgarian roses at dawn, Cambodian oud aged for decades, Italian bergamot kissed by Mediterranean sun.
                </p>
                <p>
                  Through ancient distillation techniques and modern precision, we transform these precious 
                  essences into liquid poetry that speaks to the soul.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              {[
                { number: "72", text: "Hours of maceration for each essence" },
                { number: "200", text: "Rare ingredients in our library" },
                { number: "∞", text: "Possibilities for olfactory creation" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 border border-[#444] hover:border-[#d4af37] transition-colors duration-300">
                  <div className="text-3xl font-light text-[#d4af37] mb-2">{stat.number}</div>
                  <div className="text-[#ccc] font-light">{stat.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section 
        ref={el => sectionsRef.current[3] = el}
        className="py-24 bg-[#f8f6f0] opacity-0"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <blockquote className="text-3xl md:text-4xl font-light italic mb-8 leading-relaxed text-[#2c2c2c]">
            "A fragrance is a love letter to the world, written in the language of scent, 
            signed with the soul of its creator."
          </blockquote>
          <div className="w-24 h-px bg-[#d4af37] mx-auto mb-8"></div>
          <p className="text-xl font-light text-[#666]">
            Master Perfumer, AL MARJAAN
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        ref={el => sectionsRef.current[4] = el}
        className="py-24 bg-white opacity-0"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-[#2c2c2c] mb-6">
            L'Expérience
          </h2>
          <div className="w-16 h-px bg-[#d4af37] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="text-2xl font-light text-[#2c2c2c] mb-4">Boutique Experience</h3>
              <p className="text-[#666] font-light leading-relaxed">
                Visit our flagship boutique in the UAE, where our fragrance consultants guide you 
                through a personalized olfactory journey. Discover your signature scent in an 
                atmosphere of luxury and refinement.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light text-[#2c2c2c] mb-4">Bespoke Creations</h3>
              <p className="text-[#666] font-light leading-relaxed">
                For the most discerning clients, we offer exclusive bespoke fragrance creation. 
                Work directly with our master perfumers to craft a scent that is uniquely, 
                unmistakably yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={el => sectionsRef.current[5] = el}
        className="py-24 bg-[#2c2c2c] text-white opacity-0"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Rendez-vous
          </h2>
          <div className="w-16 h-px bg-[#d4af37] mx-auto mb-12"></div>
          
          <div className="space-y-8 text-[#ccc] font-light">
            <div>
              <p className="text-xl mb-6">Discover the world of AL MARJAAN</p>
              <p className="text-lg text-[#d4af37] font-medium mb-4">
                Visit our flagship boutique or explore our collections online
              </p>
            </div>
            
            <div className="border-t border-[#444] pt-8">
              <p className="text-lg mb-4">📍 Our Atelier & Boutique</p>
              <p className="text-[#aaa] leading-relaxed">
                United Arab Emirates<br/>
                Where tradition meets innovation<br/>
                By appointment and walk-in welcome
              </p>
            </div>

            <div className="border-t border-[#444] pt-8">
              <p className="text-lg mb-2">Connect with us</p>
              <p className="text-[#aaa]">
                Follow our journey on social media<br/>
                Subscribe to our newsletter for exclusive releases
              </p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-[#444]">
            <p className="text-2xl md:text-3xl font-light mb-4">
              AL MARJAAN
            </p>
            <p className="text-[#d4af37] font-medium tracking-wider uppercase text-sm">
              Excellence Parfume — Perfumed Excellence
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .prose p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;