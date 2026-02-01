import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DonationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    monto: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDonar = async (e) => {
    e.preventDefault();
    try {
        // 1. Primero registramos/verificamos al usuario (Lo que ya probamos)
        const userResponse = await axios.post('http://localhost:3000/api/auth/check-user', {
            email: formData.email,
            nombre: formData.nombre,
            apellido: formData.apellido
        });

        if (userResponse.data.success) {
            alert(`¡Usuario listo! ID: ${userResponse.data.userId}. Ahora iríamos al pago...`);
            // AQUÍ LUEGO PONDREMOS LA LÓGICA DE STRIPE/PAYPAL
            // Por ahora, simulamos éxito y vamos al diseñador
            navigate('/design-certificate'); 
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al procesar tus datos.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#0036A0', textAlign: 'center' }}>🎓 Becas Tec - Donación</h1>
      
      <form onSubmit={handleDonar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
            <h3>1. Tus Datos</h3>
            <input 
                type="text" name="nombre" placeholder="Nombre" required 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <input 
                type="text" name="apellido" placeholder="Apellido" required 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <input 
                type="email" name="email" placeholder="Correo Electrónico" required 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px' }}
            />
        </div>

        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
            <h3>2. Tu Donativo</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                {['100', '500', '1000'].map(monto => (
                    <button 
                        key={monto}
                        type="button"
                        onClick={() => setFormData({...formData, monto})}
                        style={{ 
                            flex: 1, 
                            padding: '10px', 
                            background: formData.monto === monto ? '#0036A0' : '#eee',
                            color: formData.monto === monto ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ${monto}
                    </button>
                ))}
            </div>
            <input 
                type="number" name="monto" placeholder="Otro monto..." 
                value={formData.monto}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />
        </div>

        <button type="submit" style={{
            background: '#00b894', color: 'white', padding: '15px', 
            fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>
            💙 Continuar y Diseñar Certificado
        </button>

      </form>
    </div>
  );
};

export default DonationPage;