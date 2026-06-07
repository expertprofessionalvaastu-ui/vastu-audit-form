import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: '',
    state: '',
    country: '',
    service: 'Residential Vastu'
  });
  const [mapFile, setMapFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMapFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mapFile) {
      alert("Please upload your Floor Plan.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fileExt = mapFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Uploading map to 'house_maps' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('house_maps')
        .upload(fileName, mapFile);
        
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('house_maps')
        .getPublicUrl(fileName);
        
      const fileUrl = publicUrlData.publicUrl;

      // Inserting data into 'leads' table (Corrected table name)
      const { error: dbError } = await supabase
        .from('leads')
        .insert([
          { 
            name: formData.name, 
            phone: formData.phone, 
            email: formData.email,
            district: formData.district,
            state: formData.state,
            country: formData.country,
            service: formData.service,
            map_url: fileUrl 
          }
        ]);

      if (dbError) throw dbError;

      alert('Request bhej di gayi! Hum jald hi aapse sampark karenge.');
      
      setFormData({ 
        name: '', phone: '', email: '', district: '', state: '', country: '', service: 'Residential Vastu' 
      });
      setMapFile(null);
      e.target.reset();
      
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav>
        <div className="nav-logo">The Inner Core</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#approach">Approach</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section className="hero" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '140px 5% 80px', gap: '40px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg"></div>
        <svg className="hero-mandala" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', right: '-15%', top: '50%', transform: 'translateY(-50%)', opacity: 0.25, zIndex: 0, width: '800px', height: '800px', pointerEvents: 'none' }}>
          <circle cx="200" cy="200" r="190" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="200" cy="200" r="150" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="200" cy="200" r="100" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="200" cy="200" r="50" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="200" y1="10" x2="200" y2="390" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="10" y1="200" x2="390" y2="200" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="55" y1="55" x2="345" y2="345" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="345" y1="55" x2="55" y2="345" stroke="#C9A84C" strokeWidth="0.5"/>
          <polygon points="200,10 210,190 200,200 190,190" fill="#C9A84C"/>
          <polygon points="200,390 210,210 200,200 190,210" fill="#C9A84C"/>
          <polygon points="10,200 190,190 200,200 190,210" fill="#C9A84C"/>
          <polygon points="390,200 210,190 200,200 210,210" fill="#C9A84C"/>
        </svg>

        <div className="hero-content" style={{ flex: '1 1 450px', zIndex: 1, textAlign: 'left', marginTop: '0' }}>
          <div className="hero-tag">Dhanbad, Jharkhand · Consulting</div>
          <h1 className="hero-title">The<br/><em>Inner Core</em></h1>
          <p className="hero-subtitle">Professional Astro-Vastu Consultant</p>
          <div className="hero-divider" style={{ margin: '20px 0' }}></div>
          <p className="hero-desc" style={{ maxWidth: '90%' }}>Where ancient wisdom meets modern logic. Decoding your spaces and life through data, Vastu Shastra, and KP Astrology — to align your environment with your true potential.</p>
          <div className="hero-cta" style={{ justifyContent: 'flex-start', marginTop: '30px' }}>
            <a href="#approach" className="btn-secondary">Explore Our Approach</a>
          </div>
        </div>

        <div style={{ flex: '1 1 400px', zIndex: 2, width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(12, 12, 12, 0.75)', border: '1px solid rgba(201,168,76,0.3)', padding: '35px 30px', borderRadius: '12px', backdropFilter: 'blur(12px)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Schedule a Session</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center' }}>Har consultation strictly confidential rakhi jaati hai.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Number" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>District</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Service</label>
                <select name="service" value={formData.service} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required>
                  <option>Residential Vastu</option>
                  <option>Astrology</option>
                  <option>Astro-Vastu Combined</option>
              
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Upload Floor Plan (Map)</label>
                <input type="file" onChange={handleFileChange} className="form-input" style={{ padding: '8px', fontSize: '0.8rem' }} required />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: '4px', width: '100%', padding: '12px', fontSize: '0.9rem', letterSpacing: '2px' }}>
                {isSubmitting ? 'Submitting...' : 'Book Consultation'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="philosophy-strip">
        <div className="philosophy-item"><div className="philosophy-dot"></div>Ancient Wisdom</div>
        <div className="philosophy-item"><div className="philosophy-dot"></div>Modern Logic</div>
        <div className="philosophy-item"><div className="philosophy-dot"></div>Data & Evidence</div>
        <div className="philosophy-item"><div className="philosophy-dot"></div>Real Results</div>
        <div className="philosophy-item"><div className="philosophy-dot"></div>No Blind Faith</div>
      </div>

      <section className="about" id="about">
        <div className="about-grid">
          <div className="about-visual reveal">
            <div className="about-box">
              <span className="about-symbol">🔮</span>
              <div className="about-name">Sandeep Kumar</div>
              <div className="about-designation">Founder · The Inner Core</div>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '20px auto' }}></div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '2' }}>
                KP Astrologer<br/>
                Vastu Consultant<br/>
                Digital Creator<br/>
                Dhanbad, Jharkhand
              </div>
            </div>
          </div>
          <div className="about-content reveal">
            <div className="section-tag">About</div>
            <h2 className="section-title">Aligning Spaces<br/>with <em>Purpose</em></h2>
            <div className="gold-divider" style={{ margin: '20px 0 40px' }}></div>
            <p className="about-text">I am Sandeep Kumar — a Professional Astro-Vastu Consultant based in Dhanbad. My work bridges the gap between ancient Indian sciences and the modern, logical mind.</p>
            <p className="about-text">I do not believe in blind faith or superstition. Every recommendation I make is backed by classical Vastu Shastra principles, KP Astrology logic, and observable data — so you can understand <em>why</em> a change works, not just that it does.</p>
            <div className="about-highlight">"Results speak. My job is to decode your space and your stars — and give you practical, verifiable solutions."</div>
          </div>
        </div>
      </section>

      <section id="approach">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-tag reveal">Methodology</div>
          <h2 className="section-title reveal">A Different <em>Approach</em></h2>
        </div>
        <div className="approach-grid">
          <div className="approach-card reveal">
            <div className="approach-number">01</div>
            <div className="approach-line"></div>
            <div className="approach-title">Ancient Shastra</div>
            <p className="approach-desc">Rooted in classical Vastu Shastra and KP Astrology — systems refined over thousands of years to understand the relationship between space, time, and human life.</p>
          </div>
          <div className="approach-card reveal">
            <div className="approach-number">02</div>
            <div className="approach-line"></div>
            <div className="approach-title">Data & Logic</div>
            <p className="approach-desc">Every analysis is data-driven. I decode your space using directional science, planetary positions, and measurable factors — not vague intuition or guesswork.</p>
          </div>
          <div className="approach-card reveal">
            <div className="approach-number">03</div>
            <div className="approach-line"></div>
            <div className="approach-title">Modern Clarity</div>
            <p className="approach-desc">Solutions are practical and explainable. You will always understand the reason behind every recommendation — making you an informed participant, not just a follower.</p>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="services-header reveal">
          <div className="section-tag">Services</div>
          <h2 className="section-title">How I Can <em>Help You</em></h2>
        </div>
        <div className="services-grid">
          <div className="service-card reveal">
            <span className="service-icon">🏠</span>
            <div className="service-title">Vastu Consultation</div>
            <p className="service-desc">A complete analysis of your home or workspace — identifying energy imbalances and providing practical, cost-effective remedies grounded in classical Vastu principles.</p>
            <ul className="service-points">
              <li>Home Vastu Analysis</li>
              <li>Office & Business Vastu</li>
              <li>Plot & Construction Guidance</li>
              <li>Directional Energy Mapping</li>
              <li>Practical Remedies — No Major Demolition</li>
            </ul>
          </div>
          <div className="service-card reveal">
            <span className="service-icon">🔮</span>
            <div className="service-title">KP Astrology Reading</div>
            <p className="service-desc">Using the precision of Krishnamurti Paddhati (KP) — one of the most accurate astrological methods — to give you clarity on life events, timing, and important decisions.</p>
            <ul className="service-points">
              <li>Birth Chart Analysis</li>
              <li>Event Timing & Prediction</li>
              <li>Career & Business Guidance</li>
              <li>Relationship & Family Analysis</li>
              <li>Muhurat Selection</li>
            </ul>
          </div>
          <div className="service-card reveal">
            <span className="service-icon">✨</span>
            <div className="service-title">Astro-Vastu Combined</div>
            <p className="service-desc">A holistic session combining both disciplines — understanding how your planetary chart influences your space, and how your space can be aligned to support your cosmic energy.</p>
            <ul className="service-points">
              <li>Chart + Space Correlation</li>
              <li>Personalized Remedies</li>
              <li>Timing-Based Action Plan</li>
              <li>Follow-up Support</li>
            </ul>
          </div>
          <div className="service-card reveal">
            <span className="service-icon">📱</span>
            <div className="service-title">Online Consultation</div>
            <p className="service-desc">Distance is not a barrier. Get a full consultation via WhatsApp or video call — with detailed analysis shared digitally for your reference anytime.</p>
            <ul className="service-points">
              <li>WhatsApp Consultation</li>
              <li>Video Call Analysis</li>
              <li>Written Report Provided</li>
              <li>Available Pan India</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--dark-2)', padding: '100px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-tag reveal">How It Works</div>
          <h2 className="section-title reveal">Transparent <em>Process</em></h2>
          <div style={{ maxWidth: '700px', margin: '60px auto 0', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div className="reveal" style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '52px', height: '52px', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold)' }}>1</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '10px' }}>Scaled Floor Plan Bhejein</div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>Draftsman ya architect se banwaya to-scale floor plan bhejein — saath mein North direction clearly marked hona chahiye. Haath se bana naksha accept nahi hoga.</p>
              </div>
            </div>
            <div className="reveal" style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '52px', height: '52px', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold)' }}>2</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '10px' }}>Technical Analysis</div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>Aapke map pe 16-direction Vastu grid overlay karenge aur saath mein KP Astrology chart se milake complete analysis karenge.</p>
              </div>
            </div>
            <div className="reveal" style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: '52px', height: '52px', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold)' }}>3</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '10px' }}>Logical Consultation</div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>Findings clearly explain ki jayengi — har point ke peeche logic bataya jayega. Koi blind faith nahi, koi unnecessary darr nahi. Sirf practical solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-inner">
          <div className="section-tag reveal">Important Note</div>
          <h2 className="section-title reveal">Before You <em>Consult</em></h2>
          <div className="gold-divider" style={{ margin: '20px auto 32px' }}></div>
          
          <div className="reveal" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', padding: '36px 40px', marginBottom: '48px', textAlign: 'left', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '40px', right: '40px', height: '2px', background: 'linear-gradient(90deg,transparent,var(--gold),transparent)' }}></div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>📐 Guidelines</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', color: 'var(--cream)', marginBottom: '16px', fontStyle: 'italic', lineHeight: '1.5' }}>
              "Jaise ek doctor galat report dekh ke sahi dawai nahi de sakta — waise hum galat naksha dekh ke sahi Vastu nahi de sakte."
            </div>
            <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '20px' }}></div>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.9', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Vastu analysis ki shuruaat hoti hai ek <strong style={{ color: 'var(--cream)' }}>sahi aur to-scale floor plan</strong> se. Haath se bana naksha — chahe kitna bhi saaf ho — accurate nahi hota.
            </p>
            <p style={{ fontSize: '0.92rem', lineHeight: '1.9', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Isliye consultation se pehle apna floor plan kisi <strong style={{ color: 'var(--cream)' }}>draftsman, architect ya builder</strong> se to-scale banwayein.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: '#e74c3c', fontSize: '1rem' }}>✗</span> Haath se bana rough naksha — accurate nahi
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✓</span> Draftsman / Architect ka to-scale floor plan — sahi
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✓</span> North direction clearly marked hona chahiye
              </div>
            </div>
          </div>
          
          <div className="contact-options reveal">
            <a href="https://wa.me/91XXXXXXXXXX" className="contact-card">
              <span className="contact-card-icon">💬</span>
              <div className="contact-card-label">WhatsApp</div>
              <div className="contact-card-value">DM Now</div>
            </a>
            <a href="#" className="contact-card">
              <span className="contact-card-icon">📍</span>
              <div className="contact-card-label">Location</div>
              <div className="contact-card-value">Dhanbad, JH</div>
            </a>
            <a href="https://instagram.com/sandeepinnercore" className="contact-card">
              <span className="contact-card-icon">🌐</span>
              <div className="contact-card-label">Social</div>
              <div className="contact-card-value">@sandeepinnercore</div>
            </a>
          </div>
          
          <p className="location-note reveal">Serving clients in <span>Dhanbad · Jharkhand · Pan India</span></p>

        </div>
      </section>

      <footer>
        <div className="footer-logo">The Inner Core</div>
        <div className="footer-note">Professional Astro-Vastu Consultant · Dhanbad, Jharkhand</div>
        <div className="footer-note" style={{ color: 'rgba(201,168,76,0.5)' }}>Ancient Wisdom + Modern Logic</div>
      </footer>
    </>
  );
}

export default App;