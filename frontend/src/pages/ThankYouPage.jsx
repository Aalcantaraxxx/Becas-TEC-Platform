import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Check, Download, Share2, FileText, ShieldCheck, ExternalLink, Bell, User, QrCode, Home, Clock, Mail, UserPlus, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- LOGOS ---
import logoPrincipal from '../assets/logos/logo_tec.png';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Estado de la orden
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState(false);

  // Estados visuales y utilidades
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(0);
  
  const notificationRef = useRef(null);
  const certificatesRef = useRef(null);

  // --- 1. RECUPERAR ORDEN (Backend o Memoria) ---
  useEffect(() => {
    const fetchOrder = async () => {
        window.scrollTo(0, 0);

        // A) Si ya tenemos la orden completa (del checkout), listo.
        if (order && order.items && order.design_snapshot) {
            setLoading(false);
            return;
        }

        const orderIdFromUrl = searchParams.get('order_id');

        // B) Si no hay ID, adiós.
        if (!orderIdFromUrl) {
            if (!order) navigate('/'); 
            return;
        }

        // C) Buscar en Backend
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/orders/${orderIdFromUrl}`);
            
            if (!response.ok) throw new Error('Orden no encontrada');
            
            const data = await response.json();

            // 🚨 RECONSTRUCCIÓN DE DATOS VISUALES (CRÍTICO)
            // Si la data viene de la BD, no trae los estilos. Los ponemos por defecto.
            const enhancedOrder = {
                ...data,
                // Si no trae items (backend básico), creamos uno con el nombre del donante o genérico
                items: data.items && data.items.length > 0 ? data.items : [{ name: data.donor_info.name || "Donante", price: data.total_amount }],
                // INYECTAMOS EL DISEÑO PARA QUE EL PDF SE VEA BIEN
                design_snapshot: {
                    theme: { 
                        color: "bg-[#0036A0]", 
                        text: "text-[#0036A0]", 
                        gradient: "from-blue-900 to-blue-700",
                        logo: logoPrincipal // Usamos el import local
                    },
                    bgStyle: 2, // 2 = Gradiente elegante (tu estilo original)
                    previewStyle: { previewBg: 'bg-white' },
                    dedication: data.items?.[0]?.dedication || "Gracias por tu apoyo incondicional.",
                    cause: "Líderes del Mañana"
                }
            };

            setOrder(enhancedOrder);
        } catch (err) {
            console.error("Error recuperando orden:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    fetchOrder();
  }, [navigate, searchParams]); // Eliminamos 'order' de dependencias para evitar bucle infinito si ya existe

  // --- UTILIDADES (Timer, Click Outside) ---
  useEffect(() => {
    const timer = setInterval(() => setMinutesAgo(prev => prev + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- GENERACIÓN PDF ---
  const handleDownloadPDF = async () => {
    if (!certificatesRef.current) return;
    setIsGeneratingPdf(true);
    
    try {
        const pdf = new jsPDF('l', 'mm', 'a4'); // Horizontal
        const certificates = certificatesRef.current.children; 

        for (let i = 0; i < certificates.length; i++) {
            const element = certificates[i];
            const canvas = await html2canvas(element, {
                scale: 2, // Mejor calidad
                useCORS: true, 
                logging: false,
                backgroundColor: '#ffffff',
                width: 1122, 
                height: 794, 
                windowWidth: 1122,
                windowHeight: 794,
                x: 0, y: 0, scrollX: 0, scrollY: 0
            });
            const imgData = canvas.toDataURL('image/png');
            if (i > 0) pdf.addPage(); 
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        }
        const dateStr = new Date().toISOString().split('T')[0]; 
        pdf.save(`Certificados_Gratitud_${dateStr}.pdf`);
    } catch (error) {
        console.error("Error PDF:", error);
        alert("Error al generar el PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleShare = async () => {
    if (!order) return;
    const shareData = {
        title: '¡Acabo de donar a Becas Tec!',
        text: `Mi folio de donación es #${order.order_id.substring(0,8)}. ¡Únete tú también!`,
        url: 'https://becas.tec.protesispiernas.com' 
    };
    if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) { console.log(e); }
    } else {
        try { await navigator.clipboard.writeText(shareData.url); alert('Enlace copiado'); } catch (e) { console.error(e); }
    }
  };

  // --- RENDERIZADO DE ESTADOS ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0036A0]"></div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] text-center p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">No encontramos esa orden 😕</h1>
        <button onClick={() => navigate('/')} className="bg-[#0036A0] text-white px-6 py-2 rounded-full font-bold">Volver al Inicio</button>
    </div>
  );

  // Variables para el render
  const mainCert = order.items && order.items[0] ? order.items[0] : { name: "Benefactor" };
  // Aseguramos que design_snapshot y theme existan, si no, usamos defaults
  const design = order.design_snapshot || { 
      bgStyle: 2, 
      dedication: "Gracias por tu apoyo.", 
      cause: "Líderes del Mañana" 
  };
  const theme = design.theme || { 
      color: "bg-[#0036A0]", 
      text: "text-[#0036A0]", 
      gradient: "from-blue-900 to-blue-700",
      logo: logoPrincipal 
  };
  
  const getTimeText = () => minutesAgo < 1 ? "Hace un momento" : `Hace ${minutesAgo} min`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20 selection:bg-blue-100 relative">
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
             <img src={logoPrincipal} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" alt="Becas Tec" />
             <div className="flex flex-col leading-none">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">Becas Tec</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Donaciones</span>
             </div>
        </div>
        
        {/* Lado Derecho */}
        <div className="flex items-center gap-6">
            <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2 rounded-full transition-all focus:outline-none ${showNotifications ? 'bg-slate-100 text-[#0036A0]' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <Bell size={22}/>
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#0036A0] rounded-full border-2 border-white"></span>
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <h4 className="font-bold text-slate-800 text-sm">Actividad Reciente</h4>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 flex gap-4">
                                <div className="mt-1 text-[#0036A0] shrink-0"><CheckCircle size={18}/></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Transacción Exitosa</p>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">Donación de <span className="font-bold text-slate-700">${parseFloat(order.total_amount).toLocaleString()} MXN</span> recibida.</p>
                                    <p className="text-[9px] text-slate-400 mt-1.5 font-medium flex items-center gap-1"><Clock size={10}/> {getTimeText()}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50/30 hover:bg-blue-50 transition-colors cursor-pointer group" onClick={() => navigate('/account')}>
                                <div className="flex gap-4">
                                    <div className="mt-1 text-[#0036A0] shrink-0"><UserPlus size={18}/></div>
                                    <div>
                                        <p className="text-xs font-bold text-[#0036A0] group-hover:underline">Guardar mi perfil</p>
                                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">Crea una contraseña para guardar tus datos fiscales.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group" onClick={() => navigate('/account')}>
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#0036A0] transition-colors">{order.donor_info?.name || "Usuario"}</p>
                    <p className="text-[10px] text-slate-400">Mi Cuenta</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 group-hover:bg-[#0036A0] group-hover:text-white transition-all">
                    <User size={20} />
                </div>
            </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        
        {/* HEADER DE ÉXITO */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom-10 duration-700">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm ring-8 ring-blue-50/50">
                <div className="w-12 h-12 bg-[#0036A0] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                    <Check size={28} strokeWidth={4} />
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                ¡Gracias por transformar una vida!
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Tu generosidad impulsa el futuro educativo. Recibo enviado a <span className="font-bold text-slate-800">{order.donor_info?.email}</span>.
            </p>
        </div>

        {/* --- TARJETA PRINCIPAL (PREVIEW) --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-12">
            <div className="grid md:grid-cols-2">
                
                {/* PREVIEW VISUAL (Lado Izquierdo) */}
                <div className="p-10 bg-slate-50/50 flex items-center justify-center border-r border-slate-100 min-h-[400px]">
                    <div className="relative w-full aspect-[1.414/1] shadow-2xl rounded-lg bg-white border border-slate-200 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 group">
                        
                        {/* AQUI SE USAN LOS ESTILOS RECUPERADOS (design / theme) */}
                        <div className={`w-full h-full relative p-6 flex flex-col items-center justify-between text-center ${design.previewStyle?.previewBg || 'bg-white'}`}>
                            {design.bgStyle === 0 && <div className="absolute inset-4 border border-slate-200 pointer-events-none"></div>}
                            {/* Gradiente Azul (Default si bgStyle=2) */}
                            {design.bgStyle === 2 && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${theme.gradient} opacity-10 rounded-bl-full pointer-events-none`}></div>}
                            {design.bgStyle === 3 && <div className="absolute inset-3 border-double border-4 border-slate-200 pointer-events-none"></div>}
                            
                            {/* Marca de Agua */}
                            <div className="absolute inset-0 pointer-events-none opacity-10" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='50' font-family='Arial' font-weight='bold' font-size='30' transform='rotate(-45 50 50)' text-anchor='middle' fill='%23000' fill-opacity='0.05'%3ETEC%3C/text%3E%3C/svg%3E")`}}></div>

                            <div className="relative z-10 w-full flex flex-col h-full justify-between">
                                <div className="h-8 flex justify-center items-center gap-2">
                                    <img src={logoPrincipal} className="h-full object-contain" alt="Logo" />
                                </div>

                                <div className="flex-1 flex flex-col justify-center gap-1">
                                    <p className={`text-[6px] font-bold uppercase ${theme.text} tracking-[0.2em] mb-1 opacity-90`}>Certificado de Gratitud</p>
                                    <p className="text-[6px] text-slate-400 font-serif italic">Se otorga el presente reconocimiento a:</p>
                                    <div className="w-full border-b border-slate-200/60 pb-1 mb-1 px-4">
                                        <h2 className="font-serif font-bold text-slate-900 text-lg leading-tight line-clamp-1">{mainCert.name}</h2>
                                    </div>
                                    <p className="text-[6px] text-slate-500 italic max-w-[200px] mx-auto leading-relaxed line-clamp-2">"{design.dedication}"</p>
                                </div>

                                <div className="w-full flex justify-between items-end">
                                    <div className="text-left">
                                        <QrCode size={20} className="text-slate-800 opacity-80 mb-0.5" />
                                        <p className="text-[4px] text-slate-400 font-mono tracking-wider">{order.order_id.substring(0,8)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[4px] font-bold uppercase text-slate-300 tracking-widest mb-0.5">Emisión Digital</p>
                                        <p className="text-[5px] font-serif text-slate-600 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCIONES (Lado Derecho) */}
                <div className="p-10 md:p-14 flex flex-col justify-center">
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Tu Certificado está listo</h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Este documento digital valida tu aportación. Puedes descargarlo en alta resolución.
                    </p>

                    <button 
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPdf}
                        className="w-full py-4 bg-[#0036A0] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGeneratingPdf ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Generando PDF...
                            </>
                        ) : (
                            <><Download size={20} /> Descargar Certificado{order.items && order.items.length > 1 ? 's' : ''} (PDF)</>
                        )}
                    </button>

                    <button 
                        onClick={handleShare}
                        className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-center gap-3"
                    >
                        <Share2 size={20} /> Compartir en Redes Sociales
                    </button>
                </div>
            </div>
        </div>

        {/* DETALLES DE TRANSACCIÓN */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-12">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-6">
                <div className="bg-blue-50 p-2 rounded-lg text-[#0036A0]"><FileText size={20} /></div>
                <h3 className="font-extrabold text-slate-900 text-lg">Detalles de la Transacción</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ID DE TRANSACCIÓN</p><p className="font-mono font-bold text-slate-800 text-lg">#{order.order_id}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">MONTO TOTAL</p><p className="font-extrabold text-slate-900 text-lg">${parseFloat(order.total_amount).toLocaleString('en-US')} MXN</p></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">FECHA Y HORA</p>
                    <p className="font-medium text-slate-600 capitalize">{new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })} • {new Date(order.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-green-500"><ShieldCheck size={20}/></div>
                    <div><p className="font-bold text-slate-800 text-sm">Donación 100% Deducible</p><p className="text-xs text-slate-500">Recibirás tu CFDI en tu correo en menos de 24 hrs.</p></div>
                </div>
                <button className="text-[#0036A0] text-sm font-bold flex items-center gap-2 hover:underline">Ver recibo detallado <ExternalLink size={16} /></button>
            </div>
        </div>

        {/* FOOTER */}
        <div className="text-center pb-12">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-2 mx-auto transition-colors"><Home size={18} /> Volver al Inicio</button>
        </div>
      </main>

      {/* --- HIDDEN CERTIFICATES (VERSIÓN PDF OFICIAL) --- */}
      {/* Esta sección es idéntica a la visual pero en alta resolución para el PDF */}
      <div style={{ position: 'fixed', left: '-5000px', top: 0 }}>
        <div ref={certificatesRef}>
            {order.items && order.items.map((cert, idx) => (
                <div key={idx} style={{ 
                    width: '1122px', 
                    height: '794px', 
                    position: 'relative', 
                    backgroundColor: 'white', 
                    fontFamily: 'sans-serif',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px',
                    boxSizing: 'border-box'
                }}>
                    
                    <div className={`absolute inset-0 z-0 ${design.previewStyle?.previewBg || 'bg-white'}`}>
                         {design.bgStyle === 0 && <div className="absolute inset-8 border-4 border-slate-800 opacity-80"></div>}
                         {/* Gradiente Azul para PDF */}
                         {design.bgStyle === 2 && (
                            <>
                                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl ${theme.gradient} opacity-10 rounded-bl-full`}></div>
                                <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr ${theme.gradient} opacity-10 rounded-tr-full`}></div>
                            </>
                         )}
                         {design.bgStyle === 3 && <div className="absolute inset-6 border-[8px] border-double border-slate-300"></div>}
                    </div>

                    <div className="relative z-10 h-full flex flex-col items-center justify-between">
                        <div className="w-full flex justify-center items-center gap-16 h-32">
                            <img src={logoPrincipal} className="h-full object-contain" alt="Logo Institución" style={{maxHeight: '100px'}} />
                            {design.userLogo && (
                                <>
                                    <div className="h-20 w-[2px] bg-slate-200"></div>
                                    <img src={design.userLogo} className="h-28 object-contain opacity-90" alt="Logo Partner" style={{maxHeight: '100px'}} />
                                </>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center w-full mt-4">
                            <p style={{fontSize: '20px', letterSpacing: '0.4em', fontWeight: 'bold', textTransform: 'uppercase'}} className={`${theme.text} mb-8`}>Certificado de Gratitud</p>
                            <p style={{fontSize: '28px', fontStyle: 'italic'}} className="text-slate-500 font-serif mb-8">Se otorga el presente reconocimiento a:</p>
                            <div className="border-b-4 border-slate-200 pb-6 mb-12 w-3/4 text-center">
                                <h1 style={{fontSize: '72px', lineHeight: '1.1'}} className="font-serif font-bold text-slate-900 tracking-tight leading-tight">{cert.name}</h1>
                            </div>
                            <p style={{fontSize: '32px'}} className="text-slate-600 font-serif italic max-w-5xl leading-relaxed px-12 text-center">"{design.dedication}"</p>
                            <div className="mt-20 text-center">
                                <span className="inline-block px-10 py-3 bg-slate-100 rounded-full text-lg font-bold text-slate-500 uppercase tracking-wider mb-4">Destino del Impacto</span>
                                <p style={{fontSize: '36px'}} className={`font-bold ${theme.text}`}>{design.cause}</p>
                                {design.donorName && <p style={{fontSize: '24px'}} className="text-slate-400 mt-4 font-medium">Donado por: {design.donorName}</p>}
                            </div>
                        </div>

                        <div className="w-full flex justify-between items-end pt-12 border-t border-slate-100">
                            <div className="text-left flex items-center gap-6">
                                <div className="bg-white p-3 border border-slate-200 inline-block rounded-xl shadow-sm"><QrCode size={100} className="text-slate-800" /></div>
                                <div><p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-1">ID Único</p><p className="text-xl font-mono text-slate-600">{order.order_id}</p></div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold uppercase text-slate-400 tracking-widest mb-1">Emisión Digital</p>
                                <p className="text-3xl font-serif text-slate-700">{new Date(order.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default ThankYouPage;