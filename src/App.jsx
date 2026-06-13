import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ============================================
// BOOKING MODAL COMPONENT (Pop-up Form)
// ============================================
function BookingModal({ service, onClose }) {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', district: '', state: '', country: '', dob: '', tob: '', pob: '',
  });
  const [mapFile, setMapFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isVastu = service === 'Residential Vastu' || service === 'Commercial Vastu' || service === 'Astro-Vastu Combined';
  const isAstro = service === 'KP Astrology Reading' || service === 'Astro-Vastu Combined';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setMapFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isVastu && !mapFile) {
      alert('Please upload your Floor Plan.'); return;
    }
    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (isVastu && mapFile) {
        const fileExt = mapFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('house_maps').upload(fileName, mapFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('house_maps').getPublicUrl(fileName);
        fileUrl = publicUrlData.publicUrl;
      }

      const insertData = {
        name: formData.name, phone: formData.phone, email: formData.email,
        district: formData.district, state: formData.state, country: formData.country,
        service: service,
        ...(fileUrl && { map_url: fileUrl }),
        ...(isAstro && { dob: formData.dob || null, tob: formData.tob || null, pob: formData.pob || null }),
      };

      const { error: dbError } = await supabase.from('leads').insert([insertData]);
      if (dbError) throw dbError;

      setIsSuccess(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px', backdropFilter: 'blur(6px)',
  };

  const modalStyle = {
    background: 'rgba(12,12,12,0.97)', border: '1px solid rgba(201,168,76,0.35)',
    borderRadius: '14px', padding: '36px 32px', width: '100%', maxWidth: '460px',
    maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', color: '#f5f0e8', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginBottom: '6px',
  };

  if (isSuccess) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={{ ...modalStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🙏</div>
          <div style={{ fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>Request Received</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#f5f0e8', marginBottom: '16px' }}>Om Shanti</h3>
          <p style={{ color: 'rgba(245,240,232,0.6)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '28px' }}>
            Aapki booking request mil gayi. Hum jald hi WhatsApp ya email pe sampark karenge.
          </p>
          <button onClick={onClose} style={{
            background: 'linear-gradient(135deg, #C9A84C, #a07830)', border: 'none', borderRadius: '6px', padding: '12px 32px',
            color: '#0c0c0c', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'none', border: '1px solid rgba(201,168,76,0.3)',
          color: '#C9A84C', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        <div style={{ fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '6px', textAlign: 'center' }}>Book Session</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f5f0e8', textAlign: 'center', marginBottom: '6px' }}>{service}</h3>
        <p style={{ fontSize: '0.78rem', color: 'rgba(245,240,232,0.45)', textAlign: 'center', marginBottom: '24px' }}>Har consultation strictly confidential rakhi jaati hai.</p>
        <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.4)', margin: '0 auto 24px' }}></div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div><label style={labelStyle}>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} required /></div>
          
          {isAstro && (
            <>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} required={isAstro} /></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>Time of Birth</label><input type="time" name="tob" value={formData.tob} onChange={handleChange} style={inputStyle} required={isAstro} /></div>
              </div>
              <div><label style={labelStyle}>Place of Birth</label><input type="text" name="pob" value={formData.pob} onChange={handleChange} placeholder="City, State" style={inputStyle} required={isAstro} /></div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>District</label><input type="text" name="district" value={formData.district} onChange={handleChange} style={inputStyle} required /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} required /></div>
          </div>
          <div><label style={labelStyle}>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} required /></div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}><label style={labelStyle}>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} required /></div>
            <div style={{ flex: 1 }}><label style={labelStyle}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required /></div>
          </div>

          {isVastu && (
            <>
              <div style={{ width: '100%', height: '1px', background: 'rgba(201,168,76,0.2)', margin: '4px 0' }}></div>
              <div>
                <label style={labelStyle}>Upload Floor Plan</label>
                <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" style={{ ...inputStyle, padding: '8px' }} required={isVastu} />
              </div>
            </>
          )}

          <button type="submit" disabled={isSubmitting} style={{
            marginTop: '8px', width: '100%', padding: '13px', background: isSubmitting ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #C9A84C, #a07830)',
            border: 'none', borderRadius: '6px', color: '#0c0c0c', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}>{isSubmitting ? 'Submitting...' : 'Book Consultation'}</button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', district: '', state: '', country: '', dob: '', tob: '', pob: '', service: 'Residential Vastu'
  });
  const [mapFile, setMapFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState(null); 

  const isHeroVastu = formData.service === 'Residential Vastu' || formData.service === 'Commercial Vastu' || formData.service === 'Astro-Vastu Combined';
  const isHeroAstro = formData.service === 'KP Astrology Reading' || formData.service === 'Astro-Vastu Combined';

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

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setActiveModal(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setMapFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isHeroVastu && !mapFile) {
      alert("Please upload your Floor Plan."); return;
    }
    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (isHeroVastu && mapFile) {
        const fileExt = mapFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('house_maps').upload(fileName, mapFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('house_maps').getPublicUrl(fileName);
        fileUrl = publicUrlData.publicUrl;
      }
      
      const insertData = {
        name: formData.name, phone: formData.phone, email: formData.email,
        district: formData.district, state: formData.state, country: formData.country,
        service: formData.service,
        ...(fileUrl && { map_url: fileUrl }),
        ...(isHeroAstro && { dob: formData.dob || null, tob: formData.tob || null, pob: formData.pob || null }),
      };

      const { error: dbError } = await supabase.from('leads').insert([insertData]);
      if (dbError) throw dbError;
      
      alert('🙏 Om Shanti! Request bhej di gayi hai. Hum jald hi aapse sampark karenge.');
      setFormData({ name: '', phone: '', email: '', district: '', state: '', country: '', dob: '', tob: '', pob: '', service: 'Residential Vastu' });
      setMapFile(null);
      e.target.reset();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookBtnStyle = {
    display: 'block', width: '100%', marginTop: '20px', padding: '11px 0', background: 'transparent',
    border: '1px solid rgba(201,168,76,0.5)', borderRadius: '6px', color: '#C9A84C', fontSize: '0.75rem',
    letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s', fontWeight: '600',
  };

  return (
    <>
      {activeModal && <BookingModal service={activeModal} onClose={() => setActiveModal(null)} />}

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
          <circle cx="200" cy="200" r="190" stroke="#C9A84C" strokeWidth="0.5"/><circle cx="200" cy="200" r="150" stroke="#C9A84C" strokeWidth="0.5"/><circle cx="200" cy="200" r="100" stroke="#C9A84C" strokeWidth="0.5"/><circle cx="200" cy="200" r="50" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="200" y1="10" x2="200" y2="390" stroke="#C9A84C" strokeWidth="0.5"/><line x1="10" y1="200" x2="390" y2="200" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="55" y1="55" x2="345" y2="345" stroke="#C9A84C" strokeWidth="0.5"/><line x1="345" y1="55" x2="55" y2="345" stroke="#C9A84C" strokeWidth="0.5"/>
          <polygon points="200,10 210,190 200,200 190,190" fill="#C9A84C"/><polygon points="200,390 210,210 200,200 190,210" fill="#C9A84C"/>
          <polygon points="10,200 190,190 200,200 190,210" fill="#C9A84C"/><polygon points="390,200 210,190 200,200 210,210" fill="#C9A84C"/>
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

        {/* HERO FORM */}
        <div style={{ flex: '1 1 400px', zIndex: 2, width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(12, 12, 12, 0.75)', border: '1px solid rgba(201,168,76,0.3)', padding: '35px 30px', borderRadius: '12px', backdropFilter: 'blur(12px)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Schedule a Session</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center' }}>Har consultation strictly confidential rakhi jaati hai.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required />
              </div>

              {isHeroAstro && (
                <>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input" style={{ padding: '8px 12px', fontSize: '0.8rem' }} required={isHeroAstro} /></div>
                    <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Time</label><input type="time" name="tob" value={formData.tob} onChange={handleChange} className="form-input" style={{ padding: '8px 12px', fontSize: '0.8rem' }} required={isHeroAstro} /></div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Place of Birth</label>
                    <input type="text" name="pob" value={formData.pob} onChange={handleChange} placeholder="City, State" className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required={isHeroAstro} />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>District</label><input type="text" name="district" value={formData.district} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required /></div>
                <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required /></div>
              </div>
              
              <div><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required /></div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required /></div>
                <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required /></div>
              </div>

              <div><label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Service</label>
                <select name="service" value={formData.service} onChange={handleChange} className="form-input" style={{ padding: '10px 12px', fontSize: '0.85rem' }} required>
                  <option>Residential Vastu</option>
                  <option>Commercial Vastu</option>
                  <option>KP Astrology Reading</option>
                  <option>Astro-Vastu Combined</option>
                </select>
              </div>

              {isHeroVastu && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Upload Floor Plan (Map)</label>
                  <input type="file" onChange={handleFileChange} className="form-input" style={{ padding: '8px', fontSize: '0.8rem' }} required={isHeroVastu} />
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: '8px', width: '100%', padding: '12px', fontSize: '0.9rem', letterSpacing: '2px' }}>
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
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '2' }}>KP Astrologer<br/>Vastu Consultant<br/>Digital Creator<br/>Dhanbad, Jharkhand</div>
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
            <div className="approach-number">01</div><div className="approach-line"></div><div className="approach-title">Ancient Shastra</div>
            <p className="approach-desc">Rooted in classical Vastu Shastra and KP Astrology — systems refined over thousands of years to understand the relationship between space, time, and human life.</p>
          </div>
          <div className="approach-card reveal">
            <div className="approach-number">02</div><div className="approach-line"></div><div className="approach-title">Data & Logic</div>
            <p className="approach-desc">Every analysis is data-driven. I decode your space using directional science, planetary positions, and measurable factors — not vague intuition or guesswork.</p>
          </div>
          <div className="approach-card reveal">
            <div className="approach-number">03</div><div className="approach-line"></div><div className="approach-title">Modern Clarity</div>
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
              <li>Home Vastu Analysis</li><li>Office & Business Vastu</li><li>Plot & Construction Guidance</li><li>Directional Energy Mapping</li><li>Practical Remedies — No Major Demolition</li>
            </ul>
            <button style={bookBtnStyle} onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.12)'; e.target.style.borderColor = '#C9A84C'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(201,168,76,0.5)'; }} onClick={() => setActiveModal('Residential Vastu')}>
              Book Session →
            </button>
          </div>

          <div className="service-card reveal">
            <span className="service-icon">🔮</span>
            <div className="service-title">KP Astrology Reading</div>
            <p className="service-desc">Using the precision of Krishnamurti Paddhati (KP) — one of the most accurate astrological methods — to give you clarity on life events, timing, and important decisions.</p>
            <ul className="service-points">
              <li>Birth Chart Analysis</li><li>Event Timing & Prediction</li><li>Career & Business Guidance</li><li>Relationship & Family Analysis</li><li>Muhurat Selection</li>
            </ul>
            <button style={bookBtnStyle} onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.12)'; e.target.style.borderColor = '#C9A84C'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(201,168,76,0.5)'; }} onClick={() => setActiveModal('KP Astrology Reading')}>
              Book Session →
            </button>
          </div>

          <div className="service-card reveal">
            <span className="service-icon">✨</span>
            <div className="service-title">Astro-Vastu Combined</div>
            <p className="service-desc">A holistic session combining both disciplines — understanding how your planetary chart influences your space, and how your space can be aligned to support your cosmic energy.</p>
            <ul className="service-points">
              <li>Chart + Space Correlation</li><li>Personalized Remedies</li><li>Timing-Based Action Plan</li><li>Follow-up Support</li>
            </ul>
            <button style={bookBtnStyle} onMouseEnter={e => { e.target.style.background = 'rgba(201,168,76,0.12)'; e.target.style.borderColor = '#C9A84C'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(201,168,76,0.5)'; }} onClick={() => setActiveModal('Astro-Vastu Combined')}>
              Book Session →
            </button>
          </div>

          <div className="service-card reveal">
            <span className="service-icon">📱</span>
            <div className="service-title">Online Consultation</div>
            <p className="service-desc">Distance is not a barrier. Get a full consultation via WhatsApp or video call — with detailed analysis shared digitally for your reference anytime.</p>
            <ul className="service-points">
              <li>WhatsApp Consultation</li><li>Video Call Analysis</li><li>Written Report Provided</li><li>Available Pan India</li>
            </ul>
            <a href="https://wa.me/91XXXXXXXXXX" style={{ ...bookBtnStyle, textDecoration: 'none', textAlign: 'center', display: 'block' }}>WhatsApp Now →</a>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}><span style={{ color: '#e74c3c', fontSize: '1rem' }}>✗</span> Haath se bana rough naksha — accurate nahi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}><span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✓</span> Draftsman / Architect ka to-scale floor plan — sahi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}><span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✓</span> North direction clearly marked hona chahiye</div>
            </div>
          </div>
          <div className="contact-options reveal">
            <a href="https://wa.me/91XXXXXXXXXX" className="contact-card"><span className="contact-card-icon">💬</span><div className="contact-card-label">WhatsApp</div><div className="contact-card-value">DM Now</div></a>
            <a href="#" className="contact-card"><span className="contact-card-icon">📍</span><div className="contact-card-label">Location</div><div className="contact-card-value">Dhanbad, JH</div></a>
            <a href="https://instagram.com/sandeepinnercore" className="contact-card"><span className="contact-card-icon">🌐</span><div className="contact-card-label">Social</div><div className="contact-card-value">@sandeepinnercore</div></a>
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