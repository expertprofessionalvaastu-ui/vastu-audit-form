import { useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: '',
    state: ''
  });
  
  const [mapFile, setMapFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMapFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let mapUrl = '';

      if (mapFile) {
        const fileExt = mapFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('house_maps')
          .upload(fileName, mapFile);

        if (uploadError) {
          throw new Error("फाइल अपलोड करने में समस्या आई: " + uploadError.message);
        }

        const { data } = supabase.storage
          .from('house_maps')
          .getPublicUrl(fileName);

        mapUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            district: formData.district,
            state: formData.state,
            map_url: mapUrl
          }
        ]);

      if (insertError) {
        throw new Error("डेटा सेव करने में समस्या आई: " + insertError.message);
      }

      alert("बधाई हो! 🎉 आपका फॉर्म सफलतापूर्वक सबमिट हो गया है!");
      
      setFormData({ name: '', phone: '', email: '', district: '', state: '' });
      setMapFile(null);
      e.target.reset();

    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f6', padding: '20px', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '650px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#1e293b', fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Vastu Audit Form
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '0', lineHeight: '1.5' }}>
            Please fill in your details for the Vastu and interior audit of your space.
          </p>
          <div style={{ width: '40px', height: '4px', backgroundColor: '#3b82f6', margin: '16px auto 0', borderRadius: '2px' }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ... (इनपुट फील्ड्स वही रहेंगी) ... */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#334155', fontSize: '14px', flex: '0 0 200px', textAlign: 'left' }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Rahul Sharma" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#334155', fontSize: '14px', flex: '0 0 200px', textAlign: 'left' }}>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#334155', fontSize: '14px', flex: '0 0 200px', textAlign: 'left' }}>Email ID</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="example@email.com" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#334155', fontSize: '14px', flex: '0 0 200px', textAlign: 'left' }}>District & State</label>
            <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
              <input type="text" name="district" value={formData.district} onChange={handleChange} required placeholder="District" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} />
              <input type="text" name="state" value={formData.state} onChange={handleChange} required placeholder="State" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#334155', fontSize: '14px', flex: '0 0 200px', textAlign: 'left' }}>Upload To the Scale Map</label>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer' }} />
          </div>

          {/* नया नोटिस मैसेज */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', margin: '-10px 0 0 0' }}>
            * Please check all details above carefully before submitting the form.
          </p>

          {/* अपडेटेड सबमिट बटन */}
          <button 
            type="submit" 
            disabled={isSubmitting || !mapFile} 
            style={{ 
              marginTop: '10px', 
              padding: '16px', 
              backgroundColor: !mapFile ? '#cbd5e1' : '#1e293b', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: !mapFile ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
              transition: 'background-color 0.3s'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default App;