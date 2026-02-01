import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import logoPrincipal from '../assets/logos/logo_tec.png';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Estado alineado con tu SQL (users table)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }
    setIsLoading(true);

    // ⏳ AQUÍ CONECTAREMOS CON TU BACKEND (INSERT INTO users...)
    console.log("Registrando usuario:", formData);

    setTimeout(() => {
        setIsLoading(false);
        navigate('/account'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        <div className="p-8 md:p-10">
            {/* Header Simple */}
            <div className="text-center mb-8">
                <img src={logoPrincipal} className="h-10 mx-auto mb-4" alt="Logo" />
                <h2 className="text-3xl font-extrabold text-slate-800">Crea tu cuenta</h2>
                <p className="text-slate-500 mt-2">Guarda tus datos fiscales y simplifica tus donaciones.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
                
                {/* Nombre y Apellido (Grid) */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre(s)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                            <input type="text" name="firstName" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] text-slate-700 font-medium" placeholder="Ej. Roberto" onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Apellido(s)</label>
                        <input type="text" name="lastName" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] text-slate-700 font-medium" placeholder="Ej. Martínez" onChange={handleChange} />
                    </div>
                </div>

                {/* Email y Teléfono */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                        <input type="email" name="email" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] text-slate-700 font-medium" placeholder="tucorreo@ejemplo.com" onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Teléfono Celular</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={18} /></div>
                        <input type="tel" name="phone" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] text-slate-700 font-medium" placeholder="+52 (000) 000 0000" onChange={handleChange} />
                    </div>
                </div>

                {/* Contraseñas */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                            <input type="password" name="password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] text-slate-700 font-medium" placeholder="••••••••" onChange={handleChange} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirmar</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                            <input type="password" name="confirmPassword" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] text-slate-700 font-medium" placeholder="••••••••" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Botón Registro */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-4 bg-[#0036A0] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isLoading ? 'Registrando...' : <>Crear mi cuenta <ArrowRight size={20} /></>}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                ¿Ya tienes una cuenta? <Link to="/login" className="text-[#0036A0] font-bold hover:underline">Inicia Sesión</Link>
            </div>
        </div>

        {/* Footer Seguro */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            <span className="flex items-center gap-1"><ShieldCheck size={14}/> Datos Encriptados</span>
            <span className="flex items-center gap-1"><CheckCircle size={14}/> Oficial Tec de Monterrey</span>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;