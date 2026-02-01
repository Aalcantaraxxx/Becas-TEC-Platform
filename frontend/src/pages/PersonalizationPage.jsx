import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, ShieldAlert, CheckCircle2, X, QrCode, ChevronDown, Mail } from 'lucide-react';

// --- LOGOS ---
import logoMty from '../assets/logos/logo_tec.png';
import logoMtyShield from '../assets/logos/logo_mty.png';
import logoMilenio from '../assets/logos/logo_tecmilenio.png';
import logoSalud from '../assets/logos/logo_tecsalud.png';

const PersonalizationPage = () => {
  const { institution } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => { window.scrollTo(0, 0); }, []);
  
  const passedCause = location.state?.causeTitle;

  const causesOptions = {
    mty: ["Líderes del Mañana", "Investigación Científica", "Talento Académico"],
    milenio: ["Becas con Propósito", "Fondo de Infraestructura", "Movilidad Social"],
    salud: ["Fondo de Pacientes", "Investigación Médica", "Residentes Médicos"]
  };

  const config = {
    mty: { name: "Tecnológico de Monterrey", logo: logoMtyShield, color: "bg-[#0036A0]", text: "text-[#0036A0]", border: "border-[#0036A0]", ring: "ring-[#0036A0]", gradient: "from-blue-900 to-blue-700" },
    milenio: { name: "Tecmilenio", logo: logoMilenio, color: "bg-[#28A745]", text: "text-[#28A745]", border: "border-[#28A745]", ring: "ring-[#28A745]", gradient: "from-green-700 to-green-600" },
    salud: { name: "TecSalud", logo: logoSalud, color: "bg-[#0097D7]", text: "text-[#0097D7]", border: "border-[#0097D7]", ring: "ring-[#0097D7]", gradient: "from-sky-600 to-sky-500" }
  };

  const theme = config[institution] || config.mty;
  const availableCauses = causesOptions[institution] || ["Causa General"];
  const initialCause = passedCause && availableCauses.includes(passedCause) ? passedCause : availableCauses[0];

  const backgroundStyles = [
    { id: 0, name: "Ejecutivo", previewBg: "bg-white", previewBorder: "border-slate-200" }, 
    { id: 1, name: "Marfil", previewBg: "bg-[#FDFBF7]", previewBorder: "border-[#F0EAD6]" }, 
    { id: 2, name: "Institucional", previewBg: `bg-slate-50`, previewBorder: `border-${theme.color.replace('bg-', '')}/20` }, 
    { id: 3, name: "Clásico", previewBg: "bg-white", previewBorder: "border-slate-300" }, 
    { id: 4, name: "Papel Fino", previewBg: "bg-slate-50", previewBorder: "border-slate-200" } 
  ];

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "", // 👈 Nuevo campo
    donorName: "",
    cause: initialCause, 
    dedication: "Por su valiosa contribución para transformar vidas a través de la educación y el compromiso social.",
    bgStyle: 2, 
    userLogo: null
  });

  const [error, setError] = useState(""); // Para mensajes de validación

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({...formData, userLogo: URL.createObjectURL(file)});
  };

  // Validación antes de avanzar
  const handleContinueToCheckout = () => {
    if (!formData.recipientName.trim()) {
        setError("El nombre del beneficiario es obligatorio.");
        return;
    }
    if (!formData.recipientEmail.trim() || !formData.recipientEmail.includes('@')) {
        setError("Ingresa un correo electrónico válido para enviar el certificado.");
        return;
    }

    navigate('/checkout', { 
        state: { 
            ...formData, 
            themeConfig: theme, 
            previewStyle: backgroundStyles[formData.bgStyle] 
        } 
    });
  };

  const watermarkPattern = `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='50' fill='%23000' fill-opacity='0.03' font-family='Arial' font-weight='bold' font-size='10' transform='rotate(-45 50 50)' text-anchor='middle'%3EVISTA PREVIA%3C/text%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <nav className="bg-white border-b border-slate-200 py-3 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-slate-50 p-2 rounded-lg text-slate-500 group-hover:text-[#0036A0] group-hover:bg-blue-50 transition-all border border-slate-200">
                <ArrowLeft size={18} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="font-extrabold text-base text-slate-800">Diseñador</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Paso 2 de 3</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-100 ${theme.text}`}>{theme.name}</span>
            <button className="text-slate-400 hover:text-red-500 transition-colors text-sm font-bold">Cancelar</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start relative">
            
            {/* IZQUIERDA: FORMULARIO */}
            <div className="lg:col-span-5 space-y-6 pb-20">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Datos del Certificado</h1>
                    <p className="text-slate-500 text-sm mt-1">Completa la información para generar el documento oficial.</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
                    
                    {/* Nombre y Correo */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre del Beneficiario *</label>
                            <input 
                                type="text" 
                                placeholder="Ej. Sofia Herrera"
                                className={`w-full mt-1 bg-slate-50 border-2 ${error && !formData.recipientName ? 'border-red-300 bg-red-50' : 'border-slate-100'} rounded-xl px-4 py-3 focus:outline-none focus:${theme.border} focus:bg-white transition-all font-bold text-slate-800 placeholder:font-normal`}
                                value={formData.recipientName}
                                onChange={(e) => {setFormData({...formData, recipientName: e.target.value}); setError("");}}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico (Para envío) *</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="correo@ejemplo.com"
                                    className={`w-full pl-11 bg-slate-50 border-2 ${error && !formData.recipientEmail ? 'border-red-300 bg-red-50' : 'border-slate-100'} rounded-xl px-4 py-3 focus:outline-none focus:${theme.border} focus:bg-white transition-all font-medium text-slate-700 placeholder:font-normal`}
                                    value={formData.recipientEmail}
                                    onChange={(e) => {setFormData({...formData, recipientEmail: e.target.value}); setError("");}}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Causa a Apoyar</label>
                        <div className="relative mt-1">
                            <select 
                                value={formData.cause}
                                onChange={(e) => setFormData({...formData, cause: e.target.value})}
                                className={`w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-3 pr-10 font-bold text-slate-700 focus:outline-none focus:${theme.border} cursor-pointer`}
                            >
                                {availableCauses.map((cause, idx) => <option key={idx} value={cause}>{cause}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre del Donante (Opcional)</label>
                        <input 
                            type="text" 
                            placeholder="Tu nombre o Empresa"
                            className="w-full mt-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium"
                            value={formData.donorName}
                            onChange={(e) => setFormData({...formData, donorName: e.target.value})}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between ml-1 mb-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dedicatoria Personal</label>
                            <span className="text-[10px] font-bold text-slate-300">{formData.dedication.length}/150</span>
                        </div>
                        <textarea 
                            rows="3"
                            className={`w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:${theme.border} transition-all text-slate-600 text-sm leading-relaxed resize-none`}
                            value={formData.dedication}
                            onChange={(e) => setFormData({...formData, dedication: e.target.value})}
                            maxLength={150}
                        />
                    </div>

                    {/* Estilos */}
                    <div>
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">Estilo del Documento</label>
                         <div className="grid grid-cols-5 gap-2">
                            {backgroundStyles.map((style) => (
                                <button 
                                    key={style.id}
                                    onClick={() => setFormData({...formData, bgStyle: style.id})}
                                    className={`h-12 rounded-lg border transition-all relative overflow-hidden group ${formData.bgStyle === style.id ? `${theme.ring} ring-2 ring-offset-1` : 'hover:border-slate-400 border-slate-200'}`}
                                    title={style.name}
                                >
                                    <div className={`w-full h-full ${style.previewBg} ${style.previewBorder} border`}>
                                        {style.id === 0 && <div className="absolute inset-1 border border-slate-200 opacity-50"></div>}
                                        {style.id === 2 && <div className={`absolute inset-0 bg-gradient-to-tr ${theme.gradient} opacity-20`}></div>}
                                        {style.id === 3 && <div className="absolute inset-1 border-double border-2 border-slate-300 opacity-50"></div>}
                                        {style.id === 4 && <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '3px 3px'}}></div>}
                                    </div>
                                    
                                    {formData.bgStyle === style.id && <div className={`absolute inset-0 flex items-center justify-center ${theme.text} bg-white/60 backdrop-blur-[1px]`}><CheckCircle2 size={16}/></div>}
                                </button>
                            ))}
                         </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Logotipo Adicional (Opcional)</label>
                        {!formData.userLogo ? (
                            <label className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-3 flex gap-3 items-center justify-center text-slate-400 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                <Upload size={18} className="group-hover:text-blue-500" />
                                <span className="text-xs font-bold group-hover:text-blue-600">Subir Imagen</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                        ) : (
                            <div className="mt-2 relative border border-slate-200 rounded-xl p-2 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-white rounded border border-slate-100 flex items-center justify-center"><img src={formData.userLogo} className="max-h-full max-w-full object-contain" alt="Logo" /></div>
                                    <span className="text-xs font-bold text-slate-600">Imagen cargada</span>
                                </div>
                                <button onClick={() => setFormData({...formData, userLogo: null})} className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-lg"><X size={16} /></button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg flex items-center gap-2">
                            <ShieldAlert size={16} /> {error}
                        </div>
                    )}

                    <button 
                        onClick={handleContinueToCheckout}
                        className={`${theme.color} w-full text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4`}>
                        Continuar al Pago <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* DERECHA: PREVIEW (Sin cambios en layout) */}
            <div className="lg:col-span-7 lg:sticky lg:top-24">
                
                <div className="bg-slate-200/50 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/60 shadow-inner relative overflow-hidden">
                    
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Vista Previa en Vivo</span>
                        </div>
                    </div>

                    {/* CERTIFICADO */}
                    <div className="relative w-full aspect-[1.414/1] bg-white rounded-lg shadow-2xl overflow-hidden select-none transition-all duration-500 transform hover:scale-[1.01] origin-center border border-slate-100">
                        
                        <div className={`absolute inset-0 z-0 transition-colors duration-500 ${backgroundStyles[formData.bgStyle].previewBg}`}>
                            {formData.bgStyle === 0 && <div className="absolute inset-6 border border-slate-300"></div>}
                            {formData.bgStyle === 2 && (
                                <>
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${theme.gradient} opacity-10 rounded-bl-full`}></div>
                                    <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${theme.gradient} opacity-10 rounded-tr-full`}></div>
                                </>
                            )}
                            {formData.bgStyle === 3 && <div className="absolute inset-5 border-[3px] border-double border-slate-300"></div>}
                            {formData.bgStyle === 4 && <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '4px 4px'}}></div>}
                        </div>

                        <div className="absolute inset-0 z-10 pointer-events-none opacity-50" 
                             style={{backgroundImage: watermarkPattern, backgroundRepeat: 'repeat'}}>
                        </div>

                        <div className="absolute inset-0 z-30 flex flex-col px-8 md:px-12 pt-6 pb-8">
                            <div className="h-16 flex-none flex justify-center items-center gap-6 relative mb-2">
                                <img src={theme.logo} className="h-full object-contain" alt="Institucion" />
                                {formData.userLogo && (
                                    <>
                                        <div className="h-8 w-px bg-slate-300 mx-2"></div>
                                        <img src={formData.userLogo} className="h-[80%] object-contain grayscale opacity-80" alt="Partner" />
                                    </>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center text-center -mt-2">
                                <p className={`text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase ${theme.text} mb-2 opacity-80`}>Certificado de Gratitud</p>
                                <h2 className="text-sm md:text-base text-slate-500 font-serif italic mb-3">Se otorga el presente reconocimiento a:</h2>
                                <div className="w-full border-b border-slate-300/60 pb-4 mb-4 px-4">
                                    <h1 className="font-serif font-bold text-slate-900 tracking-tight leading-tight line-clamp-2 text-2xl md:text-4xl lg:text-5xl">
                                        {formData.recipientName || "Nombre del Beneficiario"}
                                    </h1>
                                </div>
                                <p className="text-slate-600 font-serif italic leading-relaxed max-w-lg mx-auto line-clamp-3 text-xs md:text-sm lg:text-base px-6">
                                    "{formData.dedication}"
                                </p>
                                <div className="mt-5 flex flex-col items-center gap-1">
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 backdrop-blur-sm">Destino del Impacto</span>
                                    <p className={`text-xs font-bold ${theme.text} mt-0.5`}>{formData.cause}</p>
                                    {formData.donorName && <p className="text-[9px] text-slate-400 mt-1 font-medium">Donado por: <span className="text-slate-600 font-bold">{formData.donorName}</span></p>}
                                </div>
                            </div>

                            <div className="h-12 flex-none flex justify-between items-end border-t border-transparent w-full">
                                <div className="text-left w-1/4">
                                    <div className="bg-white/80 backdrop-blur-sm p-1 border border-slate-200 w-10 h-10 md:w-12 md:h-12 mb-1 flex items-center justify-center"><QrCode className="text-slate-800 opacity-90 w-full h-full" /></div>
                                    <p className="text-[6px] font-mono text-slate-400 uppercase tracking-wide">ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                                </div>
                                <div className="text-right w-1/4">
                                    <p className="text-[6px] font-bold uppercase tracking-widest text-slate-400">Emisión Digital</p>
                                    <p className="text-[8px] md:text-[9px] font-serif text-slate-600 font-medium whitespace-nowrap">{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 py-2.5 rounded-full shadow-sm">
                        <ShieldAlert size={14} className="text-slate-400" />
                        <span>Documento oficial con sellos de seguridad digital.</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationPage;