import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Building2, History, FileText, Settings, LogOut, 
    Save, Bell, ChevronDown, CheckCircle, Download,
    ShieldCheck, CreditCard, MapPin, AlertCircle
} from 'lucide-react';

import logoPrincipal from '../assets/logos/logo_tec.png';

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // Estados de datos
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Estado para el botón de guardar

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    navigate('/login');
  };

  // --- CARGA INICIAL ---
  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${apiUrl}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Sesión expirada');
            
            const data = await res.json();
            setUserData(data);
        } catch (error) {
            handleLogout();
        } finally {
            setLoading(false);
        }
    };
    fetchProfile();
  }, [navigate]);

  // --- GUARDAR DATOS FISCALES ---
  const handleSaveFiscal = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    // Aquí recolectarías los datos del form...
    // Por simplicidad en este ejemplo, simulamos el guardado
    setTimeout(() => {
        setSaving(false);
        alert("Datos guardados correctamente");
    }, 1000);
  };

  // --- RENDERIZADO DE CARGA ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0036A0]"></div>
    </div>
  );

  if (!userData) return null;

  // Desestructuración segura
  const { user, stats, fiscal, history } = userData;

  // --- COMPONENTES UI ---
  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm mb-1 ${
            activeTab === id 
            ? 'bg-blue-50 text-[#0036A0]' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
    >
        <Icon size={20} className={activeTab === id ? 'text-[#0036A0]' : 'text-slate-400'} />
        {label}
    </button>
  );

  const DashboardHeader = () => (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-slate-100 gap-4">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                {activeTab === 'overview' && 'Hola, ' + user.first_name + ' 👋'}
                {activeTab === 'history' && 'Historial de Donaciones'}
                {activeTab === 'fiscal' && 'Información Fiscal'}
                {activeTab === 'security' && 'Configuración'}
            </h1>
            <p className="text-sm text-slate-400 font-medium">
                {activeTab === 'overview' ? 'Aquí tienes un resumen de tu impacto.' : 'Gestiona los detalles de tu cuenta.'}
            </p>
        </div>

        <div className="flex items-center gap-6 self-end md:self-auto">
            <button className="relative text-slate-400 hover:text-[#0036A0] transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* PERFIL A LA DERECHA (Solicitado) */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{user.first_name} {user.last_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Miembro desde {user.joined}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0036A0] to-blue-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/20 cursor-pointer hover:scale-105 transition-transform">
                    {user.initials}
                </div>
            </div>
        </div>
    </header>
  );

  // --- TABS ---
  const OverviewTab = () => (
    <div className="animate-in fade-in duration-300">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-[#0036A0] rounded-xl"><CreditCard size={24} /></div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donado</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">${stats.totalDonated.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={24} /></div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Becas Apoyadas</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.donationsCount}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><ShieldCheck size={24} /></div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil Fiscal</p>
                <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                    {fiscal ? <><CheckCircle size={16} className="text-teal-500"/> Completo</> : <><AlertCircle size={16} className="text-orange-500"/> Pendiente</>}
                </p>
            </div>
        </div>

        <div className="bg-[#0036A0] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
            <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-3">Tu impacto transforma vidas</h3>
                <p className="text-blue-100 mb-8 leading-relaxed text-sm">
                    Gracias a tus aportaciones, estudiantes de Líderes del Mañana pueden continuar sus estudios.
                </p>
                <button onClick={() => navigate('/')} className="bg-white text-[#0036A0] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg text-sm">
                    Hacer nueva donación
                </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>
    </div>
  );

  const FiscalTab = () => (
    <div className="animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-800">Información de Facturación</h3>
                    <p className="text-xs text-slate-500 mt-1">Datos para tu CFDI 4.0 automático.</p>
                </div>
                <div className="bg-blue-100 text-[#0036A0] text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <ShieldCheck size={14} /> ENCRIPTADO
                </div>
            </div>
            
            <form onSubmit={handleSaveFiscal} className="p-8 grid md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">RFC</label>
                    <input type="text" defaultValue={fiscal?.rfc} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 uppercase text-sm" placeholder="XAXX010101000" />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Razón Social</label>
                    <input type="text" defaultValue={fiscal?.razon_social} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 uppercase text-sm" placeholder="NOMBRE COMPLETO" />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Régimen Fiscal</label>
                    <div className="relative">
                        <select defaultValue={fiscal?.regime_code} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 text-sm appearance-none">
                            <option value="">Selecciona...</option>
                            <option value="605">605 - Sueldos y Salarios</option>
                            <option value="626">626 - RESICO</option>
                            <option value="612">612 - Personas Físicas Act. Emp.</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-end mt-4">
                    <button type="submit" disabled={saving} className="bg-[#0036A0] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center gap-2 text-sm disabled:opacity-70">
                        {saving ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex">
        {/* SIDEBAR */}
        <aside className="w-20 md:w-64 bg-white h-screen sticky top-0 border-r border-slate-200 flex flex-col transition-all duration-300 z-10">
            <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-50 cursor-pointer" onClick={() => navigate('/')}>
                <img src={logoPrincipal} className="h-8 w-auto object-contain" alt="Logo" />
                <span className="ml-3 font-extrabold text-slate-800 tracking-tight hidden md:block">Becas Tec</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <SidebarItem id="overview" label={<span className="hidden md:inline">Mi Impacto</span>} icon={Building2} />
                <SidebarItem id="history" label={<span className="hidden md:inline">Historial</span>} icon={History} />
                <SidebarItem id="fiscal" label={<span className="hidden md:inline">Datos Fiscales</span>} icon={FileText} />
                <div className="pt-4 mt-4 border-t border-slate-100">
                    <SidebarItem id="security" label={<span className="hidden md:inline">Configuración</span>} icon={Settings} />
                </div>
            </nav>

            <div className="p-4 border-t border-slate-50">
                <button onClick={handleLogout} className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                    <LogOut size={20} />
                    <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
            </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 min-w-0 overflow-y-auto h-screen">
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                <DashboardHeader />
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'fiscal' && <FiscalTab />}
                {/* Historial Placeholder */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                                <tr><th className="p-4">Fecha</th><th className="p-4">Folio</th><th className="p-4">Monto</th><th className="p-4 text-right">Recibo</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {history.map((h, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-4">{new Date(h.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 font-mono text-slate-500">#{h.uuid.substring(0,8)}</td>
                                        <td className="p-4 font-bold">${parseFloat(h.amount).toLocaleString()}</td>
                                        <td className="p-4 text-right"><button className="text-[#0036A0] hover:bg-blue-50 p-2 rounded"><Download size={16}/></button></td>
                                    </tr>
                                ))}
                                {history.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">Sin donaciones recientes</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    </div>
  );
};

export default AccountPage;