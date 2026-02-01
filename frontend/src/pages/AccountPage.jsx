import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Building2, History, FileText, Settings, LogOut, 
    Save,  User, Bell, ChevronDown, CheckCircle, Download,
    ShieldCheck, CreditCard, MapPin
} from 'lucide-react';

// LOGO
import logoPrincipal from '../assets/logos/logo_tec.png';

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // Datos Simulados (Pronto vendrán de tu DB 'users')
  const user = {
    firstName: "Angel",
    lastName: "Alcantara",
    email: "angele2705@gmail.com",
    initials: "AA",
    joined: "Enero 2026", // created_at
    totalDonated: 12500,
    donationsCount: 5
  };

  // --- COMPONENTES ---

  // 1. SIDEBAR (Limpio y Minimalista)
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

  // 2. HEADER SUPERIOR (Perfil a la derecha)
  const DashboardHeader = () => (
    <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">
                {activeTab === 'overview' && 'Panel General'}
                {activeTab === 'history' && 'Historial de Donaciones'}
                {activeTab === 'fiscal' && 'Información Fiscal'}
                {activeTab === 'security' && 'Configuración de Cuenta'}
            </h1>
            <p className="text-sm text-slate-400">Gestiona tu impacto y tus datos personales.</p>
        </div>

        <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Miembro desde {user.joined}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0036A0] to-blue-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/20 cursor-pointer hover:scale-105 transition-transform">
                    {user.initials}
                </div>
            </div>
        </div>
    </header>
  );

  // 3. TAB: RESUMEN (Overview)
  const OverviewTab = () => (
    <div className="animate-in fade-in duration-300">
        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-[#0036A0] rounded-xl"><CreditCard size={24} /></div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">+12% vs mes pasado</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donado</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">${user.totalDonated.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={24} /></div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Becas Apoyadas</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{user.donationsCount}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><ShieldCheck size={24} /></div>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfil Fiscal</p>
                    <p className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                        <CheckCircle size={16} className="text-teal-500" /> Completo
                    </p>
                </div>
            </div>
        </div>

        {/* Banner CTA */}
        <div className="bg-[#0036A0] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
            <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-3">Tu generosidad trasciende</h3>
                <p className="text-blue-100 mb-8 leading-relaxed">
                    Gracias a ti, estamos más cerca de la meta anual. ¿Te gustaría programar una donación recurrente y multiplicar tu impacto?
                </p>
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-white text-[#0036A0] px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
                >
                    Hacer nueva donación
                </button>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
    </div>
  );

  // 4. TAB: DATOS FISCALES (Conectado a tu DB Schema)
  const FiscalTab = () => (
    <div className="animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-800">Información de Facturación</h3>
                    <p className="text-xs text-slate-500 mt-1">Estos datos se usarán para generar tus CFDI 4.0 automáticamente.</p>
                </div>
                <div className="bg-blue-100 text-[#0036A0] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <ShieldCheck size={14} /> Datos Encriptados
                </div>
            </div>
            
            <form className="p-8 grid md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* RFC & Razón Social */}
                <div className="md:col-span-2 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">RFC</label>
                        <input type="text" placeholder="XAXX010101000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 uppercase" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Razón Social</label>
                        <input type="text" placeholder="Tu Nombre o Empresa S.A. de C.V." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 uppercase" />
                    </div>
                </div>

                {/* Régimen y Uso (Dropdowns según SAT) */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Régimen Fiscal</label>
                    <div className="relative">
                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 appearance-none">
                            <option value="">Selecciona...</option>
                            <option value="605">605 - Sueldos y Salarios</option>
                            <option value="626">626 - RESICO</option>
                            <option value="601">601 - General de Ley Personas Morales</option>
                            <option value="612">612 - Personas Físicas Act. Empresarial</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Uso de CFDI</label>
                    <div className="relative">
                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700 appearance-none">
                            <option value="D04">D04 - Donativos (Recomendado)</option>
                            <option value="G03">G03 - Gastos en General</option>
                            <option value="S01">S01 - Sin efectos fiscales</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Dirección (Tabla Addresses) */}
                <div className="md:col-span-2 pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={16} /> Domicilio Fiscal</p>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Calle</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">No. Ext</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">No. Int</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Código Postal</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Colonia</label>
                            <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Estado</label>
                             <div className="relative">
                                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none">
                                    <option>Nuevo León</option>
                                    <option>CDMX</option>
                                    <option>Jalisco</option>
                                    <option>Querétaro</option>
                                    <option>Puebla</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-end mt-4">
                    <button type="button" className="bg-[#0036A0] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center gap-2 transform active:scale-95">
                        <Save size={18} /> Guardar Información
                    </button>
                </div>
            </form>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-20 md:w-64 bg-white h-screen sticky top-0 border-r border-slate-200 flex flex-col transition-all duration-300">
            
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-50 cursor-pointer" onClick={() => navigate('/')}>
                <img src={logoPrincipal} className="h-8 w-auto object-contain" alt="Logo" />
                <span className="ml-3 font-extrabold text-slate-800 tracking-tight hidden md:block">Becas Tec</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <SidebarItem id="overview" label={<span className="hidden md:inline">Mi Impacto</span>} icon={Building2} />
                <SidebarItem id="history" label={<span className="hidden md:inline">Historial</span>} icon={History} />
                <SidebarItem id="fiscal" label={<span className="hidden md:inline">Datos Fiscales</span>} icon={FileText} />
                <div className="pt-4 mt-4 border-t border-slate-100">
                    <SidebarItem id="security" label={<span className="hidden md:inline">Configuración</span>} icon={Settings} />
                </div>
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t border-slate-50">
                <button className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                    <LogOut size={20} />
                    <span className="hidden md:inline">Cerrar Sesión</span>
                </button>
            </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 min-w-0">
            <div className="max-w-5xl mx-auto p-6 md:p-12">
                <DashboardHeader />
                
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'fiscal' && <FiscalTab />}
                {/* Placeholder para otras tabs */}
                {activeTab === 'history' && (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center animate-in fade-in">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <History size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Historial de Donaciones</h3>
                        <p className="text-slate-500 mt-2">Aquí aparecerá la lista de tus donativos pasados.</p>
                    </div>
                )}
                {activeTab === 'security' && (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center animate-in fade-in">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Settings size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Seguridad</h3>
                        <p className="text-slate-500 mt-2">Opciones para cambiar contraseña y privacidad.</p>
                    </div>
                )}
            </div>
        </main>

    </div>
  );
};

export default AccountPage;