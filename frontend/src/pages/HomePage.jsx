import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, HeartPulse, Building2, FileText, Globe, Smartphone, ShieldCheck, Play, X } from 'lucide-react'; // 👈 Agregamos Play y X

// --- IMPORTACIÓN DE IMÁGENES LOCALES ---
import logoPrincipal from '../assets/logos/logo_tec.png';
import heroBg from '../assets/images/hero_bg.jpg';
import transparenciaBg from '../assets/images/transparencia_bg.jpg';

import logoMty from '../assets/logos/logo_mty.png';
import logoMilenio from '../assets/logos/logo_tecmilenio.png';
import logoSalud from '../assets/logos/logo_tecsalud.png';

// Imagenes de Causas en Local
import imgTalento from '../assets/images/beca_talento.jpg';
import imgInvestigacion from '../assets/images/beca_cientifica.jpg';
import imgLideres from '../assets/images/beca_lideres.jpg';
import imgBecasPropósito from '../assets/images/beca_proposito.jpeg';
import imgFondoInfraestructura from '../assets/images/beca_estructura.jpg';
import imgMovilidadSocial from '../assets/images/beca_impacto.jpg';
import imgFondoPacientes from '../assets/images/beca_pacientes.jpg';
import imgInvestigacionMedica from '../assets/images/beca_medica.jpg';
import imgResidentesMedicos from '../assets/images/beca_residentes.jpg';

// --- ASIGNACIÓN A CONSTANTES ---
const LOGO_MTY = logoMty;
const LOGO_MILENIO = logoMilenio;
const LOGO_SALUD = logoSalud;

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mty');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showVideo, setShowVideo] = useState(false); // 👈 Estado para el video

  // Lógica de Scroll y detección de sección activa
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['hero', 'causas', 'transparencia', 'impacto'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -300 && rect.top <= 300) {
            setActiveSection(section);
            break; 
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  // --- DATOS DE CAUSAS ---
  const causesData = [
    // TEC DE MONTERREY
    { id: 1, institution: 'mty', title: "Líderes del Mañana", desc: "Beca del 100% para jóvenes con talento extraordinario y compromiso social.", meta: "$12.5M MXN", metaLabel: "META ANUAL", image: imgLideres, tag: "Más Solicitado", color: "bg-blue-900" },
    { id: 2, institution: 'mty', title: "Investigación Científica", desc: "Apoyo a laboratorios buscando soluciones sustentables para el futuro.", meta: "15 Proyectos", metaLabel: "EN CURSO", image: imgInvestigacion, tag: "Innovación", color: "bg-blue-800" },
    { id: 3, institution: 'mty', title: "Talento Académico", desc: "Becas parciales para estudiantes brillantes que necesitan un impulso.", meta: "+3,000 Alumnos", metaLabel: "BENEFICIADOS", image: imgTalento, tag: "Educación", color: "bg-indigo-900" },
    // TECMILENIO
    { id: 4, institution: 'milenio', title: "Becas con Propósito", desc: "Ayuda a estudiantes a financiar su propósito de vida profesional.", meta: "800 Becas", metaLabel: "META 2026", image: imgBecasPropósito, tag: "Propósito", color: "bg-green-600" },
    { id: 5, institution: 'milenio', title: "Fondo de Infraestructura", desc: "Mejora de aulas y laboratorios para una educación práctica de calidad.", meta: "5 Campus", metaLabel: "RENOVACIÓN", image: imgFondoInfraestructura, tag: "Campus", color: "bg-green-700" },
    { id: 6, institution: 'milenio', title: "Movilidad Social", desc: "Programas de apoyo para comunidades vulnerables a través de la educación.", meta: "$2M MXN", metaLabel: "RECAUDADO", image: imgMovilidadSocial, tag: "Impacto Social", color: "bg-emerald-600" },
    // TECSALUD
    { id: 7, institution: 'salud', title: "Fondo de Pacientes", desc: "Atención médica de alta especialidad para personas de escasos recursos.", meta: "200 Pacientes", metaLabel: "ATENCIÓN", image: imgFondoPacientes, tag: "Ayuda Directa", color: "bg-sky-600" },
    { id: 8, institution: 'salud', title: "Investigación Médica", desc: "Protocolos clínicos para combatir cáncer, diabetes y enfermedades neurológicas.", meta: "12 Protocolos", metaLabel: "ACTIVOS", image: imgInvestigacionMedica, tag: "Ciencia", color: "bg-sky-500" },
    { id: 9, institution: 'salud', title: "Residentes Médicos", desc: "Apoyo a la formación de la próxima generación de especialistas médicos.", meta: "50 Becas", metaLabel: "ESPECIALISTAS", image: imgResidentesMedicos, tag: "Futuro", color: "bg-cyan-600" },
  ];

  const filteredCauses = causesData.filter(cause => cause.institution === activeTab);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
             <img 
                src={logoPrincipal} 
                onError={(e) => {e.target.style.display='none'; document.getElementById('fallback-icon').style.display='flex'}}
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                alt="Logo Becas Tec" 
             />
             <div id="fallback-icon" className="hidden bg-primary text-white p-1.5 rounded-lg items-center justify-center">
                <GraduationCap size={24} />
             </div>
             
             <div className="flex flex-col leading-none">
                <span className={`font-extrabold text-xl tracking-tight ${scrolled ? 'text-primary' : 'text-slate-800'}`}>Becas Tec</span>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${scrolled ? 'text-slate-400' : 'text-slate-500'}`}>Donaciones</span>
             </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-md p-1 rounded-full border border-white/40 shadow-sm">
            {[
              { id: 'hero', label: 'Inicio' },
              { id: 'causas', label: 'Causas' },
              { id: 'transparencia', label: 'Transparencia' },
              { id: 'impacto', label: 'Impacto' }
            ].map((item) => (
               <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 relative ${activeSection === item.id 
                    ? 'text-primary' 
                    : 'text-slate-500 hover:text-slate-900'}`}
               >
                 {item.label}
                 {activeSection === item.id && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                 )}
               </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-bold px-6 py-2.5 rounded-full bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm">
              Login
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 pb-20">
        
        {/* HERO SECTION */}
        <section id="hero" className="pt-28 pb-10 max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden min-h-[650px] flex items-center shadow-2xl group">
            <div className="absolute inset-0">
                 <img 
                    src={heroBg} 
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"}
                    className="w-full h-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
                    alt="Graduada"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full px-8 md:px-20 py-12 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-widest uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Convocatoria Abierta 2026
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
                    Transforma vidas con un <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                        Certificado de Gratitud
                    </span>
                </h1>
                
                <p className="text-slate-200 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-xl opacity-90">
                    Apoya el talento y la salud a través de donaciones con impacto real. Reconoce a alguien especial mientras cambias el mundo.
                </p>
                
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => scrollToSection('causas')}
                        className="px-8 py-4 bg-primary hover:bg-blue-800 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/40 hover:-translate-y-1 transition-all flex items-center gap-3"
                    >
                        Crear Certificado 
                        <ArrowRight size={20} />
                    </button>
                    {/* 👇 BOTÓN VER VIDEO ACTUALIZADO */}
                    <button 
                        onClick={() => setShowVideo(true)}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg transition-all flex items-center gap-2 group"
                    >
                         <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all">
                            <Play size={16} fill="currentColor" />
                         </div>
                         Ver Video
                    </button>
                </div>
            </div>
          </div>
        </section>

        {/* --- MODAL DE VIDEO (Overlay) --- */}
        {showVideo && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all" onClick={() => setShowVideo(false)}>
                <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setShowVideo(false)}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all"
                    >
                        <X size={24} />
                    </button>
                    <iframe 
                        className="w-full h-full" 
                        src="https://www.youtube.com/embed/MGXzivaVTtY?autoplay=1" 
                        title="Líderes del Mañana 2025" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        )}

        {/* CAUSAS DISPONIBLES */}
        <section id="causas" className="max-w-7xl mx-auto mb-32 pt-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Causas Disponibles</h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-md">Selecciona una institución para ver cómo puedes apoyar.</p>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full gap-2">
                    <button onClick={() => setActiveTab('mty')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 min-w-[180px] justify-center outline-none focus:outline-none focus:ring-0 ${activeTab === 'mty' ? 'bg-[#0036A0] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <div className="h-6 w-6 relative flex items-center justify-center"><img src={LOGO_MTY} className={`max-h-full max-w-full object-contain transition-all ${activeTab === 'mty' ? 'brightness-0 invert' : ''}`} alt="Tec" /></div> Tec de Monterrey
                    </button>
                    <button onClick={() => setActiveTab('milenio')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 min-w-[180px] justify-center outline-none focus:outline-none focus:ring-0 ${activeTab === 'milenio' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <div className="h-6 w-6 relative flex items-center justify-center"><img src={LOGO_MILENIO} className={`max-h-full max-w-full object-contain transition-all ${activeTab === 'milenio' ? 'brightness-0 invert' : ''}`} alt="Milenio" /></div> Tecmilenio
                    </button>
                    <button onClick={() => setActiveTab('salud')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 min-w-[180px] justify-center outline-none focus:outline-none focus:ring-0 ${activeTab === 'salud' ? 'bg-[#0097D7] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <div className="h-6 w-6 relative flex items-center justify-center"><img src={LOGO_SALUD} className={`max-h-full max-w-full object-contain transition-all ${activeTab === 'salud' ? 'brightness-0 invert' : ''}`} alt="Salud" /></div> TecSalud
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCauses.map((cause) => (
                    <div 
                        key={cause.id} 
                        onClick={() => navigate(`/personalizar/${cause.institution}`, { state: { causeTitle: cause.title } })} 
                        className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-lg hover:shadow-2xl hover:border-blue-100 transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-2"
                    >
                        <div className="h-56 w-full rounded-[2rem] overflow-hidden relative mb-5 bg-slate-100">
                             <img src={cause.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cause.title} />
                             <div className={`absolute top-4 left-4 ${cause.color} text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md`}>{cause.tag}</div>
                        </div>
                        <div className="px-3 pb-2 flex flex-col flex-grow">
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-primary transition-colors">{cause.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6 flex-grow">{cause.desc}</p>
                            <div className="pt-5 border-t border-slate-100 flex justify-between items-center mt-auto">
                                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cause.metaLabel}</p><p className={`text-lg font-bold ${cause.color.replace('bg-', 'text-')}`}>{cause.meta}</p></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all ${cause.color} group-hover:scale-110`}><ArrowRight size={18} /></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* TRANSPARENCIA */}
        <section id="transparencia" className="max-w-7xl mx-auto mb-32 grid md:grid-cols-2 gap-12 items-center pt-10">
            <div className="order-2 md:order-1 relative rounded-[3rem] overflow-hidden shadow-2xl h-[550px] group">
                <img 
                    src={transparenciaBg} 
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1576091160550-2187d80018f7?q=80&w=1470"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Innovación y Transparencia"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent flex flex-col justify-end p-12">
                    <div className="bg-sky-500 w-fit px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase mb-4 shadow-sm">Innovación en Salud</div>
                    <h3 className="text-white text-3xl font-bold mb-3 leading-tight">Investigación que salva vidas</h3>
                    <p className="text-white/90 text-sm max-w-md leading-relaxed">Los fondos se canalizan directamente a protocolos clínicos de alto impacto y formación de talento.</p>
                 </div>
            </div>

            <div className="order-1 md:order-2 space-y-8 px-4 lg:pl-12">
                <div>
                    <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Confianza y Claridad</h2>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">¿A dónde va tu donativo?</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    Diseñamos un sistema de trazabilidad completa. Tu confianza es el motor que transforma realidades, y queremos que veas cada paso del camino.
                </p>
                
                <div className="space-y-6 py-4">
                    <div className="flex gap-5 items-start group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-1">100% Deducible</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Recibe tu recibo fiscal digital (CFDI) automáticamente al completar tu donación.</p>
                        </div>
                    </div>
                    <div className="flex gap-5 items-start group">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-1">Seguridad Garantizada</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">Tus datos y transacciones están protegidos con encriptación de grado bancario.</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/impacto-transparencia')}
                    className="inline-flex items-center gap-3 text-primary font-bold text-lg hover:gap-5 transition-all mt-4 group"
                >
                    Ver Reporte Anual de Transparencia 2025 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>

        {/* IMPACTO */}
        <section id="impacto" className="max-w-6xl mx-auto mb-32 pt-10">
            <div className="bg-[#0B1120]/95 backdrop-blur-xl rounded-[3rem] p-12 md:py-16 md:px-20 relative overflow-hidden text-white shadow-2xl border border-white/5">
                 <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] opacity-60 animate-pulse-slow"></div>
                 <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] opacity-60 animate-pulse-slow" style={{animationDelay: '2s'}}></div>

                 <div className="relative z-10 text-center mb-16">
                    <h2 className="text-sm font-bold text-blue-400 tracking-[0.2em] uppercase mb-3">Resultados Acumulados</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold">Nuestro Impacto en Números</h3>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <HeartPulse size={28} className="text-blue-400 mx-auto mb-4" />
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">12k</div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Vidas Transformadas</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <Building2 size={28} className="text-emerald-400 mx-auto mb-4" />
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">+45M</div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">MXN Recaudados</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                             <GraduationCap size={28} className="text-purple-400 mx-auto mb-4" />
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">850</div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Certificados</p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <Globe size={28} className="text-orange-400 mx-auto mb-4" />
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">32</div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Campus Activos</p>
                        </div>
                    </div>
                 </div>
            </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto mb-20">
             <div className="bg-white rounded-[3rem] shadow-2xl p-12 md:p-20 text-center relative overflow-hidden border border-slate-100/50">
                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">¿Listo para marcar la diferencia?</h2>
                    <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto font-medium">
                        Tu contribución hoy es el éxito de alguien el día de mañana. Elige una causa y crea tu certificado.
                    </p>
                    <button 
                        onClick={() => scrollToSection('causas')} 
                        className="px-12 py-5 bg-primary text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:bg-blue-900 transition-all hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        Ver Causas y Donar
                        <ArrowRight size={24} />
                    </button>
                </div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl mix-blend-multiply"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl mix-blend-multiply"></div>
             </div>
        </section>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto border-t border-slate-200 pt-16 pb-8 text-sm text-slate-500 px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-2">
                    <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => navigate('/')}>
                        <img 
                            src={logoPrincipal} 
                            onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}}
                            className="h-8 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                            alt="Logo Footer" 
                        />
                        <div className="hidden bg-slate-200 text-slate-500 p-1.5 rounded-lg items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <GraduationCap size={18} />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-extrabold text-lg text-slate-400 group-hover:text-primary transition-colors">Becas Tec</span>
                            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-300 group-hover:text-primary/60 transition-colors">Donaciones</span>
                        </div>
                    </div>
                    <p className="leading-relaxed max-w-sm font-medium">
                        Plataforma oficial de filantropía del Tecnológico de Monterrey. Conectamos tu generosidad con el talento que transformará México.
                    </p>
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-xs tracking-widest uppercase mb-6">Plataforma</h4>
                    <ul className="space-y-4 font-medium">
                        <li><button onClick={() => scrollToSection('causas')} className="hover:text-primary transition-colors">Causas</button></li>
                        <li><button onClick={() => scrollToSection('transparencia')} className="hover:text-primary transition-colors">Transparencia</button></li>
                        <li><button onClick={() => scrollToSection('impacto')} className="hover:text-primary transition-colors">Impacto</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-xs tracking-widest uppercase mb-6">Legal y Ayuda</h4>
                    <ul className="space-y-4 font-medium">
                        <li><a href="#" className="hover:text-primary transition-colors">Aviso de Privacidad</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Preguntas Frecuentes</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold gap-4 text-slate-400">
                <p>© 2026 Tecnológico de Monterrey. Todos los derechos reservados.</p>
                <div className="flex gap-6">
                    <span className="flex items-center gap-2 hover:text-slate-600 cursor-pointer transition-colors"><Globe size={14}/> Español - México</span>
                    <span className="flex items-center gap-2 hover:text-slate-600 cursor-pointer transition-colors"><Smartphone size={14}/> Versión Móvil</span>
                </div>
            </div>
        </footer>

      </main>
    </div>
  );
};

export default HomePage;