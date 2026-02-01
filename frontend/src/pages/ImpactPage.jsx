import { useEffect } from 'react'; // 👈 IMPORTANTE: Agregamos esto
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, ShieldCheck, HeartHandshake, Download, Globe, Smartphone, GraduationCap } from 'lucide-react';

// --- IMPORTACIÓN DE IMÁGENES ---
import logoPrincipal from '../assets/logos/logo_tec.png';
import logoMty from '../assets/logos/logo_mty.png';
import logoMilenio from '../assets/logos/logo_tecmilenio.png';
import logoSalud from '../assets/logos/logo_tecsalud.png';

const ImpactPage = () => {
  const navigate = useNavigate();

  // 👇 ESTO ARREGLA EL PROBLEMA DEL SCROLL
  // Cada vez que entres a esta página, te mandará hasta arriba automáticamente.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <img src={logoPrincipal} className="h-8 w-auto object-contain" alt="Becas Tec" />
                <div className="hidden md:block h-6 w-px bg-slate-200 mx-2"></div>
                <span className="hidden md:block text-xs font-bold tracking-widest text-slate-400 uppercase">Impacto</span>
            </div>
            
            <div className="flex items-center gap-8">
                <div className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
                    <button onClick={() => navigate('/')} className="hover:text-[#0036A0] transition-colors">Inicio</button>
                    {/* Al ir a Causas, usamos un timeout pequeño para asegurar que cargue Home primero */}
                    <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('causas')?.scrollIntoView(), 100); }} className="hover:text-[#0036A0] transition-colors">Causas</button>
                </div>
                <button 
                    onClick={() => { navigate('/'); setTimeout(() => document.getElementById('causas')?.scrollIntoView(), 100); }}
                    className="bg-[#0036A0] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                    Crear mi Certificado
                </button>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-[#0036A0] mb-6 tracking-tight">
                    Impacto y Transparencia
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    Tu confianza es el motor que transforma vidas. Diseñamos este espacio para que conozcas cómo cada peso se convierte en una oportunidad tangible.
                </p>
            </div>
            
            <button className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:border-[#0036A0] hover:text-[#0036A0] transition-all group">
                <Download size={20} />
                Ver Reporte Anual 2025
            </button>
        </div>

        {/* --- GRID DE CONFIANZA --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            
            <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-50 text-[#0036A0] rounded-2xl flex items-center justify-center mb-6">
                    <FileText size={24} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">100% Deducible</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Deducción Inmediata</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Recibe tu recibo fiscal digital al instante de completar tu donación. Listo para tu declaración anual.
                </p>
            </div>

            <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-50 text-[#0036A0] rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={24} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Seguridad Garantizada</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Cifrado Bancario</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Protegemos tus datos con los más altos estándares de seguridad internacional y encriptación de punta.
                </p>
            </div>

            <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-50 text-[#0036A0] rounded-2xl flex items-center justify-center mb-6">
                    <HeartHandshake size={24} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Impacto Directo</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Sin Intermediarios</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    El 100% de tu aportación llega a la causa seleccionada, sin comisiones administrativas ocultas.
                </p>
            </div>
        </div>

        {/* --- SECCIÓN CENTRAL --- */}
        <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">¿A dónde va tu donativo?</h2>
            <div className="h-1 w-20 bg-[#0036A0] mx-auto rounded-full"></div>
        </div>

        {/* BLOQUE 1: EDUCACIÓN */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 lg:order-1 pr-8">
                <span className="inline-block px-3 py-1 bg-blue-50 text-[#0036A0] text-xs font-bold rounded-full mb-6">
                    Educación de Excelencia
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Transformando el futuro de México
                </h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    Tu contribución se destina directamente a becas de excelencia académica. Cada certificado emitido representa horas de laboratorio, libros y mentorías para la próxima generación de líderes.
                </p>
                <button className="flex items-center gap-2 text-[#0036A0] font-bold hover:gap-4 transition-all group">
                    Conocer historias de becarios <ArrowRight size={20} />
                </button>
            </div>
            
            <div className="order-1 lg:order-2 h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Estudiantes" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
        </div>

        {/* BLOQUE 2: SALUD */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
            <div className="order-1 h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                <img 
                    src="https://conecta.tec.mx/sites/default/files/styles/header_full/public/2021-11/investigacion-tecsalud-emcs-0.webp" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Doctora" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="order-2 pl-8">
                <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 text-xs font-bold rounded-full mb-6">
                    Investigación en Salud
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Innovación que salva vidas
                </h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    A través de TecSalud, los fondos se canalizan a protocolos de investigación clínica. Estamos desarrollando tratamientos de vanguardia y llevando medicina de alta especialidad a comunidades vulnerables.
                </p>
                <button className="flex items-center gap-2 text-cyan-600 font-bold hover:gap-4 transition-all group">
                    Ver avances médicos <ArrowRight size={20} />
                </button>
            </div>
        </div>

        {/* --- LOGOS --- */}
        <div className="border-t border-slate-100 pt-20 pb-20 text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-12">
                Instituciones que respaldan este compromiso
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-3">
                    <img src={logoMty} className="h-10 object-contain grayscale" alt="Tec" />
                    <span className="font-bold text-slate-600 text-xl">Tec de Monterrey</span>
                </div>
                <div className="flex items-center gap-3">
                    <img src={logoMilenio} className="h-10 object-contain grayscale" alt="Milenio" />
                    <span className="font-bold text-slate-600 text-xl">Tecmilenio</span>
                </div>
                <div className="flex items-center gap-3">
                    <img src={logoSalud} className="h-10 object-contain grayscale" alt="Salud" />
                    <span className="font-bold text-slate-600 text-xl">TecSalud</span>
                </div>
            </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-100 pt-16 pb-8 text-sm bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-slate-900 text-white p-1 rounded">
                             <GraduationCap size={20} />
                        </div>
                        <span className="font-extrabold text-xl text-slate-900">Donataria Autorizada</span>
                    </div>
                    <p className="leading-relaxed max-w-sm text-slate-500 font-medium">
                        "Certificados con Propósito" es una iniciativa oficial respaldada por los procesos de transparencia más rigurosos. Tu donativo es seguro y legalmente reconocido.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-xs tracking-widest uppercase mb-6">Legal</h4>
                    <ul className="space-y-4 font-medium text-slate-500">
                        <li><a href="#" className="hover:text-[#0036A0]">Aviso de Privacidad</a></li>
                        <li><a href="#" className="hover:text-[#0036A0]">Términos de Uso</a></li>
                        <li><a href="#" className="hover:text-[#0036A0]">Políticas de Devolución</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-xs tracking-widest uppercase mb-6">Contacto</h4>
                    <ul className="space-y-4 font-medium text-slate-500">
                        <li>Centro de Ayuda</li>
                        <li>Preguntas Frecuentes</li>
                        <li>hola@certificados.tec.mx</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold gap-4 text-slate-400">
                <p>© 2026 Certificados con Propósito. Todos los derechos reservados.</p>
                <div className="flex gap-6">
                    <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer"><Globe size={14}/> Español</span>
                    <span className="flex items-center gap-1 text-green-500"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Status: Online</span>
                </div>
            </div>
          </div>
      </footer>

    </div>
  );
};

export default ImpactPage;