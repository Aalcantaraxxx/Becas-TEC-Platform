import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, FileSpreadsheet, ChevronDown, AlertCircle, QrCode, Plus, Trash2, Users, Download, UploadCloud, User, CheckCircle2, XCircle, X } from 'lucide-react';

// --- LOGOS ---
import logoPrincipal from '../assets/logos/logo_tec.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  // 1. RECUPERAR DATOS Y PROTEGER RUTA
  const state = location.state || {}; 

  useEffect(() => {
    // Si entran directo por URL (sin datos previos), sacar al usuario al Home
    if (!location.state) {
        navigate('/');
    }
    window.scrollTo(0, 0);
  }, [location.state, navigate]);

  // Evitamos renderizar si no hay estado para prevenir errores visuales antes del redirect
  if (!location.state) return null;
  
  const designData = {
    cause: state.cause || "Causa General",
    dedication: state.dedication || "Dedicatoria...",
    donorNamePreview: state.donorName || "", 
    theme: state.themeConfig || { name: "Tec de Monterrey", color: "bg-[#0036A0]", text: "text-[#0036A0]", logo: logoPrincipal },
    bgStyle: state.bgStyle || 0,
    previewStyle: state.previewStyle || { previewBg: "bg-white", previewBorder: "border-slate-200" },
    userLogo: state.userLogo
  };

  // --- ESTADOS ---
  const [donorData, setDonorData] = useState({ name: "", email: "" });
  const [certificates, setCertificates] = useState([{ id: 1, name: state.recipientName || "", email: state.recipientEmail || "", amount: "1,000" }]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Errores y Validaciones
  const [errors, setErrors] = useState({});
  const [expWarning, setExpWarning] = useState(""); // ⚠️ Estado para advertencia en tiempo real
  const [showCsvModal, setShowCsvModal] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [cardData, setCardData] = useState({ number: '', exp: '', cvc: '', name: '' });
  
  // Datos Fiscales Completos
  const [fiscalData, setFiscalData] = useState({ 
    rfc: '', 
    razon: '', 
    regimen: '605', // Default: Sueldos y Salarios
    usoCfdi: 'D04', // 👈 AJUSTE: Default a Donativos (Correcto para deducibilidad)
    cp: '', 
    calle: '', 
    noExt: '', 
    noInt: '', 
    colonia: '', 
    municipio: '', 
    estado: '' 
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  // --- HELPERS ---
  const updateCertificate = (id, field, value) => {
    const updated = certificates.map(c => {
        if (c.id === id) {
            if (field === 'amount') {
                let val = value.replace(/[^0-9]/g, '');
                if (val && parseInt(val) > 250000) val = "250000"; 
                return { ...c, [field]: val ? Number(val).toLocaleString('en-US') : "" };
            }
            return { ...c, [field]: value };
        }
        return c;
    });
    setCertificates(updated);
  };

  const addCertificate = () => setCertificates([...certificates, { id: Date.now(), name: "", email: "", amount: "1,000" }]);
  const removeCertificate = (id) => { if (certificates.length > 1) setCertificates(certificates.filter(c => c.id !== id)); };
  const setQuickAmount = (id, value) => {
    const updated = certificates.map(c => c.id === id ? { ...c, amount: value.toLocaleString('en-US') } : c);
    setCertificates(updated);
  };

  // CSV
  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Nombre Completo,Correo Electronico,Monto\nJuan Perez,juan@email.com,1000\nMaria Lopez,maria@email.com,2500";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_destinatarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const lines = evt.target.result.split('\n').slice(1);
            const newCerts = [];
            lines.forEach((line, idx) => {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const name = parts[0]?.trim();
                    const email = parts[1]?.trim();
                    let amount = parts[2]?.trim().replace(/[^0-9]/g, '') || "1000";
                    if (parseInt(amount) > 250000) amount = "250000";
                    if (name && email) newCerts.push({ id: Date.now() + idx, name, email, amount: parseInt(amount).toLocaleString('en-US') });
                }
            });
            if (newCerts.length > 0) {
                setCertificates(newCerts);
                setShowCsvModal(false);
                showToast(`✅ Se importaron ${newCerts.length} destinatarios.`, "success");
            }
        } catch (error) { showToast("Error al leer CSV.", "error"); }
    };
    reader.readAsText(file);
  };

  const totalAmount = certificates.reduce((sum, c) => sum + parseFloat(c.amount.replace(/,/g, '') || 0), 0);

  // --- VALIDACIÓN DE FECHA EN TIEMPO REAL ---
  const handleCardExp = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 3) value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    
    setCardData({ ...cardData, exp: value });

    // Validación lógica inmediata (Feedback visual instantáneo)
    if (value.length === 5) {
        const [mm, yy] = value.split('/');
        const month = parseInt(mm, 10);
        const year = parseInt(yy, 10);

        if (month < 1 || month > 12) {
            setExpWarning("Mes inválido (01-12)");
        } else if (year < 26) {
            setExpWarning("Tarjeta vencida (Año mín. 26)");
        } else {
            setExpWarning(""); // Todo bien
        }
    } else {
        setExpWarning(""); // Limpiar si borran
    }
  };

  // --- 🚀 PROCESAR PAGO ---
  const handleDonate = async () => {
    const newErrors = {};
    let hasError = false;

    // Validaciones Frontend
    if (!donorData.name.trim()) { newErrors.donorName = true; hasError = true; }
    if (!donorData.email.trim() || !donorData.email.includes('@')) { newErrors.donorEmail = true; hasError = true; }
    
    certificates.forEach((c, index) => {
        if (!c.name.trim()) { newErrors[`name_${index}`] = true; hasError = true; }
        if (!c.email.trim() || !c.email.includes('@')) { newErrors[`email_${index}`] = true; hasError = true; }
        const amt = parseFloat(c.amount.replace(/,/g, '') || 0);
        if (![500, 1000, 5000].includes(amt) && amt < 1001) { newErrors[`amount_msg_${index}`] = "Mínimo $1,001"; hasError = true; }
    });

    if (totalAmount > 250000) { showToast("El monto total excede el límite de $250,000 MXN.", "error"); return; }

    if (paymentMethod === 'card') {
        if (cardData.number.length < 19) { newErrors.card = true; hasError = true; }
        if (cardData.cvc.length < 3) { newErrors.cvc = true; hasError = true; }
        if (!cardData.name.trim()) { newErrors.cardName = true; hasError = true; }
        
        // Revisamos si quedó la advertencia de fecha o si está incompleta
        if (cardData.exp.length < 5 || expWarning) { newErrors.exp = true; hasError = true; }
    }

    if (wantsInvoice) {
        if (fiscalData.rfc.length < 12) { newErrors.rfc = true; hasError = true; }
        if (!fiscalData.razon) { newErrors.razon = true; hasError = true; }
        if (!fiscalData.cp || fiscalData.cp.length < 5) { newErrors.cp = true; hasError = true; }
        if (!fiscalData.calle) { newErrors.calle = true; hasError = true; }
        // Se valida que existan los datos obligatorios del SAT
    }

    setErrors(newErrors);
    if (hasError) { 
        showToast("Por favor corrige los campos marcados en rojo.", "error"); 
        // Si hay error de fecha, aseguramos que se vea el mensaje si el usuario lo ignoró
        if(newErrors.exp && !expWarning) setExpWarning("Fecha requerida");
        return; 
    }

    // --- CONEXIÓN AL BACKEND ---
    setIsProcessing(true);

    try {
        const response = await fetch('http://localhost:3000/api/donations/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                donor_email: donorData.email,
                donor_name: donorData.name,
                total_amount: totalAmount,
                items: certificates,
                fiscal_data: wantsInvoice ? fiscalData : null,
                design: designData
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            setIsProcessing(false);
            showToast(data.message || "Error al procesar la donación.", "error");
            window.scrollTo(0, 0);
            return;
        }

        console.log("✅ TRANSACCIÓN REGISTRADA EN DB:", data);
        
        const orderPayload = {
            order_id: data.order_id,
            total_amount: totalAmount,
            currency: 'MXN',
            donor_info: donorData,
            items: certificates,
            design_snapshot: designData,
            created_at: new Date().toISOString()
        };

        navigate('/thank-you', { state: { order: orderPayload } });

    } catch (error) {
        console.error("Error de red:", error);
        setIsProcessing(false);
        showToast("No se pudo conectar con el servidor.", "error");
    }
  };

  const watermarkPattern = `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50' y='50' fill='%23000' fill-opacity='0.05' font-family='Arial' font-weight='bold' font-size='14' transform='rotate(-45 50 50)' text-anchor='middle'%3ECOPIA%3C/text%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20 selection:bg-blue-100 relative overflow-x-hidden">
      
      {/* TOAST */}
      {toast.show && (
        <div className={`fixed top-24 right-6 z-[100] bg-white border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'} shadow-2xl rounded-lg p-4 flex items-start gap-3 max-w-sm animate-in slide-in-from-right duration-300`}>
            <div className={`mt-0.5 ${toast.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</div>
            <div>
                <h4 className="font-bold text-sm text-slate-800">{toast.type === 'success' ? '¡Éxito!' : 'Atención'}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-300 hover:text-slate-500"><X size={16}/></button>
        </div>
      )}

      {/* MODAL CSV */}
      {showCsvModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
                <button onClick={() => setShowCsvModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 text-[#0036A0] rounded-2xl flex items-center justify-center mx-auto mb-4"><FileSpreadsheet size={32} /></div>
                    <h3 className="text-xl font-extrabold text-slate-900">Importar Destinatarios</h3>
                    <p className="text-sm text-slate-500 mt-2">Sube un CSV: Nombre, Correo, Monto.</p>
                </div>
                <div className="space-y-4">
                    <button onClick={downloadTemplate} className="w-full py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-[#0036A0] hover:text-[#0036A0] transition-all flex items-center justify-center gap-2"><Download size={18} /> Descargar Plantilla</button>
                    <div className="relative">
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        <button onClick={() => fileInputRef.current.click()} className="w-full py-4 bg-[#0036A0] text-white font-bold rounded-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"><UploadCloud size={20} /> Seleccionar Archivo CSV</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <img src={logoPrincipal} className="h-8 w-auto object-contain" alt="Logo" />
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <div className="flex flex-col leading-none"><span className="font-bold text-sm text-slate-700">Plataforma de Pagos</span><span className="text-[10px] text-green-600 flex items-center gap-1 font-medium"><Lock size={10} /> Encriptación Bancaria</span></div>
        </div>
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Volver al diseño</button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Finalizar Donación</h1>
        <p className="text-slate-500 mb-8">Completa tus datos para recibir tu confirmación.</p>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
                
                {/* 1. TUS DATOS */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4"><div className="w-6 h-6 rounded-full bg-blue-100 text-[#0036A0] flex items-center justify-center text-xs">1</div> Tus Datos de Contacto</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Tu Nombre *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Nombre" value={donorData.name} onChange={(e) => setDonorData({ ...donorData, name: e.target.value })} className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.donorName ? 'border-red-300' : 'border-slate-200'} rounded-xl font-bold text-slate-700 focus:outline-none focus:border-blue-500`} /></div></div>
                        <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Tu Correo *</label><input type="email" placeholder="Para confirmación" value={donorData.email} onChange={(e) => setDonorData({ ...donorData, email: e.target.value })} className={`w-full px-4 py-3 bg-slate-50 border ${errors.donorEmail ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium text-slate-700 focus:outline-none focus:border-blue-500`} /></div>
                    </div>
                </div>

                {/* 2. DESTINATARIOS */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 text-[#0036A0] flex items-center justify-center text-xs">2</div> Destinatarios</h2>
                        <div className="flex gap-2"><button onClick={() => setShowCsvModal(true)} className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2"><FileSpreadsheet size={14} /> CSV</button><button onClick={addCertificate} className="text-xs font-bold text-[#0036A0] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1"><Plus size={14} /> Manual</button></div>
                    </div>
                    <div className="space-y-6">
                        {certificates.map((cert, index) => (
                            <div key={cert.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 relative group hover:border-blue-300">
                                {certificates.length > 1 && <button onClick={() => removeCertificate(cert.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1 bg-white rounded-full shadow-sm z-10"><Trash2 size={14} /></button>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nombre Beneficiario</label><input type="text" value={cert.name} onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)} className={`w-full bg-white border ${errors[`name_${index}`] ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm font-bold text-slate-700`} placeholder="Nombre completo" /></div>
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Correo (Envío)</label><input type="email" value={cert.email} onChange={(e) => updateCertificate(cert.id, 'email', e.target.value)} className={`w-full bg-white border ${errors[`email_${index}`] ? 'border-red-300' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm font-medium text-slate-600`} placeholder="correo@ejemplo.com" /></div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Monto</label>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">{[500, 1000, 5000].map(val => (<button key={val} onClick={() => setQuickAmount(cert.id, val)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${parseInt(cert.amount.replace(/,/g, '')) === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>${val.toLocaleString()}</button>))}</div>
                                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span><input type="text" value={cert.amount} onChange={(e) => updateCertificate(cert.id, 'amount', e.target.value)} className={`w-full pl-6 pr-12 py-2 bg-white border ${errors[`amount_${index}`] || errors[`amount_msg_${index}`] ? 'border-red-300' : 'border-slate-200'} rounded-lg font-bold text-slate-800`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">MXN</span></div>
                                    {errors[`amount_msg_${index}`] && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors[`amount_msg_${index}`]}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. PAGO (Con Validación Real-Time) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 text-[#0036A0] flex items-center justify-center text-xs">3</div> Método de Pago</h2>
                    {paymentMethod === 'card' && (
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tarjeta</label><div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="0000 0000 0000 0000" maxLength="19" value={cardData.number} onChange={(e) => { let v = e.target.value.replace(/\D/g, '').substring(0, 16); v = v.replace(/(\d{4})(?=\d)/g, "$1 "); setCardData({ ...cardData, number: v }); }} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.card ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium text-slate-700`} /></div></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Vencimiento</label>
                                    <input type="text" placeholder="MM/AA" maxLength="5" value={cardData.exp} onChange={handleCardExp} className={`w-full px-4 py-3 bg-slate-50 border ${errors.exp || expWarning ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl font-medium text-slate-700`} />
                                    {/* ⚠️ ADVERTENCIA EN TIEMPO REAL */}
                                    {expWarning && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/> {expWarning}</p>}
                                </div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CVC</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="password" placeholder="123" maxLength="4" value={cardData.cvc} onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g,'')})} className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.cvc ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium text-slate-700`} /></div></div>
                            </div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre en Tarjeta</label><input type="text" placeholder="Como en el plástico" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})} className={`w-full px-4 py-3 bg-slate-50 border ${errors.cardName ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium text-slate-700 uppercase`} /></div>
                        </div>
                    )}
                </div>

                {/* 4. INFORMACIÓN FISCAL COMPLETA (Nuevos campos) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-100 text-[#0036A0] flex items-center justify-center text-xs">4</div> Información Fiscal</h2>
                        <div className="flex items-center gap-3"><span className={`text-sm font-bold ${wantsInvoice ? 'text-[#0036A0]' : 'text-slate-400'}`}>Solicitar CFDI</span><button onClick={() => setWantsInvoice(!wantsInvoice)} className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${wantsInvoice ? 'bg-[#0036A0]' : 'bg-slate-200'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${wantsInvoice ? 'translate-x-5' : 'translate-x-0'}`}></div></button></div>
                    </div>
                    
                    {wantsInvoice && (
                        <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in">
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 mb-2">Ingresa tus datos tal cual aparecen en tu Constancia de Situación Fiscal.</div>
                            
                            {/* RFC y Razón Social */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">RFC *</label><input type="text" placeholder="XAXX010101000" maxLength="13" value={fiscalData.rfc} onChange={(e) => setFiscalData({...fiscalData, rfc: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 13)})} className={`w-full px-4 py-3 bg-slate-50 border ${errors.rfc ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium`} /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Razón Social *</label><input type="text" placeholder="Tu Nombre o Empresa" value={fiscalData.razon} onChange={(e) => setFiscalData({...fiscalData, razon: e.target.value.toUpperCase()})} className={`w-full px-4 py-3 bg-slate-50 border ${errors.razon ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium`} /></div>
                            </div>

                            {/* Régimen y Uso CFDI */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Régimen Fiscal</label>
                                    <div className="relative">
                                        <select value={fiscalData.regimen} onChange={(e) => setFiscalData({...fiscalData, regimen: e.target.value})} className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-sm">
                                            <option value="605">605 - Sueldos y Salarios</option>
                                            <option value="626">626 - Resico</option>
                                            <option value="601">601 - General de Ley Personas Morales</option>
                                            <option value="612">612 - Personas Físicas Act. Empresarial</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Uso de CFDI</label>
                                    <div className="relative">
                                        <select value={fiscalData.usoCfdi} onChange={(e) => setFiscalData({...fiscalData, usoCfdi: e.target.value})} className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-sm">
                                            <option value="D04">D04 - Donativos (Deducible)</option>
                                            <option value="G03">G03 - Gastos en general</option>
                                            <option value="S01">S01 - Sin efectos fiscales</option>
                                            <option value="CP01">CP01 - Pagos</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Dirección */}
                            <div className="grid grid-cols-4 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CP *</label><input type="text" placeholder="00000" maxLength="5" value={fiscalData.cp} onChange={(e) => setFiscalData({...fiscalData, cp: e.target.value.replace(/\D/g, '').substring(0, 5)})} className={`w-full px-4 py-3 bg-slate-50 border ${errors.cp ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium`} /></div>
                                <div className="col-span-3"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Calle *</label><input type="text" value={fiscalData.calle} onChange={(e) => setFiscalData({...fiscalData, calle: e.target.value})} className={`w-full px-4 py-3 bg-slate-50 border ${errors.calle ? 'border-red-300' : 'border-slate-200'} rounded-xl font-medium`} /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">No. Exterior</label><input type="text" value={fiscalData.noExt} onChange={(e) => setFiscalData({...fiscalData, noExt: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">No. Interior</label><input type="text" value={fiscalData.noInt} onChange={(e) => setFiscalData({...fiscalData, noInt: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" /></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Colonia</label><input type="text" value={fiscalData.colonia} onChange={(e) => setFiscalData({...fiscalData, colonia: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Municipio</label><input type="text" value={fiscalData.municipio} onChange={(e) => setFiscalData({...fiscalData, municipio: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Estado</label><input type="text" value={fiscalData.estado} onChange={(e) => setFiscalData({...fiscalData, estado: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium" /></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DERECHA: RESUMEN */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Resumen del Pedido</h3>
                    
                    {/* MINI PREVIEW */}
                    <div className="w-full aspect-[1.414/1] bg-slate-100 rounded-lg mb-6 shadow-inner border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                        <div className={`w-[90%] h-[90%] shadow-lg rounded border flex flex-col items-center justify-between p-4 relative overflow-hidden ${designData.previewStyle.previewBg} ${designData.previewStyle.previewBorder}`}>
                            {designData.bgStyle === 2 && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${designData.theme.gradient} opacity-10 rounded-bl-full`}></div>}
                            <div className="absolute inset-0 pointer-events-none opacity-40" style={{backgroundImage: watermarkPattern}}></div>
                            <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-2">
                                <div className="flex items-center gap-2 h-6"><img src={designData.theme.logo} className="h-full object-contain" alt="Logo" /></div>
                                <div className="text-center w-full px-2">
                                    <p className={`text-[5px] font-bold uppercase ${designData.theme.text} mb-1`}>Gratitud</p>
                                    <div className="w-full border-b border-slate-200 pb-1 mb-1"><h1 className="font-serif font-bold text-slate-900 text-[10px] leading-tight line-clamp-1">{certificates[0].name || "Nombre"}</h1></div>
                                    <p className="text-[4px] text-slate-500 font-serif italic leading-tight line-clamp-2">"{designData.dedication}"</p>
                                </div>
                                <div className="w-full flex justify-between items-end"><QrCode size={10} className="text-slate-300" /><div className="text-[4px] text-slate-400 font-bold uppercase">Comunidad Tec</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-6">
                        <div className="flex justify-between items-center text-sm"><span className="font-bold text-slate-500 flex gap-2 items-center"><Users size={16}/> Cantidad</span><span className="font-bold text-slate-800">{certificates.length} Certificado{certificates.length > 1 ? 's' : ''}</span></div>
                        <div className="flex justify-between items-center py-4 border-t border-b border-slate-100 border-dashed"><span className="text-slate-500 font-medium">Total a Pagar</span><span className="text-3xl font-extrabold text-[#0036A0] tracking-tight">${totalAmount.toLocaleString('en-US')} <span className="text-sm font-normal text-slate-400">MXN</span></span></div>
                        {totalAmount > 250000 && <p className="text-xs text-red-500 font-bold text-center bg-red-50 p-2 rounded-lg mb-2">Excede el límite mensual de $250,000</p>}
                        <button onClick={handleDonate} disabled={isProcessing} className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#0036A0] hover:bg-blue-800 hover:-translate-y-1'}`}>
                            {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Lock size={20} />}
                            {isProcessing ? 'Procesando...' : 'Finalizar Donación'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;