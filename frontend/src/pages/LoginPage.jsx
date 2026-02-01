import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, LogIn } from 'lucide-react';
import logoPrincipal from '../assets/logos/logo_tec.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ⏳ AQUÍ CONECTAREMOS CON TU BACKEND LUEGO
    console.log("Enviando login:", formData);
    
    // Simulación de éxito (borrar cuando conectemos backend)
    setTimeout(() => {
        setIsLoading(false);
        navigate('/account'); // Redirigir al Dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-[#0036A0] p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <img src={logoPrincipal} className="h-8 w-auto" alt="Logo" />
                </div>
                <h2 className="text-2xl font-bold text-white">¡Hola de nuevo!</h2>
                <p className="text-blue-200 text-sm mt-1">Ingresa para gestionar tus donaciones.</p>
            </div>
            {/* Decoración Fondo */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mt-10"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-10 -mb-10"></div>
        </div>

        {/* Formulario */}
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
                
                {/* Email */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Electrónico</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            name="email"
                            required
                            placeholder="ejemplo@correo.com" 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] focus:bg-white transition-all text-slate-700 font-medium"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock size={18} />
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            required
                            placeholder="••••••••" 
                            className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] focus:bg-white transition-all text-slate-700 font-medium"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="text-right mt-2">
                        <a href="#" className="text-xs font-bold text-[#0036A0] hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>

                {/* Botón Login */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#0036A0] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>Ingresar <ArrowRight size={20} /></>
                    )}
                </button>

            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                    ¿Aún no tienes cuenta?{' '}
                    <Link to="/signup" className="text-[#0036A0] font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>

        {/* Aviso Seguro */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <LogIn size={12} /> Acceso Seguro SSL 256-bit
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;