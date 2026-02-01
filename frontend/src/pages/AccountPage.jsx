import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, FileText, History, LogOut, Settings, 
    Shield, CreditCard, Download, ExternalLink, 
    Save, Building2, MapPin, Mail, Phone, CheckCircle, AlertCircle
} from 'lucide-react';

// LOGO (Asegúrate de que la ruta sea correcta)
import logoPrincipal from '../assets/logos/logo_tec.png';

const AccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'fiscal', 'history', 'security'
  const [isLoading, setIsLoading] = useState(false);

  // Simulación de Usuario (En el futuro esto vendrá de tu Backend/Context)
  const user = {
    name: "Angel Alcantara",
    email: "angele2705@gmail.com",
    initials: "AA",
    joined: "Enero 2026",
    totalDonated: 12500,
    donationsCount: 5
  };

  // --- COMPONENTES INTERNOS ---

  // 1. SIDEBAR NAVIGATION
  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm mb-1 ${
            activeTab === id 
            ? 'bg-[#0036A0] text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm'
        }`}
    >
        <Icon size={18} className={activeTab === id ? 'text-white' : 'text-slate-400'} />
        {label}
    </button>
  );

  // 2. CONTENIDO: RESUMEN (Overview)
  const OverviewTab = () => (
    <div className="animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Hola, {user.name} 👋</h2>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-[#0036A0] rounded-xl"><Building2 size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donado</p>
                    <p className="text-2xl font-extrabold text-slate-900">${user.totalDonated.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FileText size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Becas Apoyadas</p>
                    <p className="text-2xl font-extrabold text-slate-900">{user.donationsCount}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Shield size={24} /></div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estado Fiscal</p>
                    <p className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mt-1">Información Completa</p>
                </div>
            </div>
        </div>

        {/* Banner de Impacto */}
        <div className="bg-gradient-to-r from-[#0036A0] to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Tu impacto está transformando vidas</h3>
                <p className="text-blue-100 text-sm max-w-lg mb-6 leading-relaxed">
                    Gracias a tus aportaciones, 3 estudiantes de Líderes del Mañana han podido continuar sus estudios este semestre.
                </p>
                <button className="bg-white text-[#0036A0] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
                    Hacer nueva donación
                </button>
            </div>
            {/* Decoración Fondo */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute right-20 bottom-0 w-32 h-32 bg-white opacity-5 rounded-full pointer-events-none"></div>
        </div>
    </div>
  );

  // 3. CONTENIDO: DATOS FISCALES (Fiscal)
  const FiscalTab = () => (
    <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Datos de Facturación (CFDI)</h2>
            <button className="text-sm text-[#0036A0] font-bold hover:underline flex items-center gap-1">
                <AlertCircle size={16} /> ¿Por qué necesitamos esto?
            </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <form className="grid md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Razón Social / Nombre Completo</label>
                    <input type="text" defaultValue="Angel Alcantara" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">RFC</label>
                    <input type="text" defaultValue="XAXX010101000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Régimen Fiscal</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700">
                        <option>605 - Sueldos y Salarios</option>
                        <option>626 - RESICO</option>
                        <option>612 - Personas Físicas Act. Empresarial</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Código Postal</label>
                    <input type="text" defaultValue="64849" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Uso de CFDI</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0036A0] font-medium text-slate-700">
                        <option>D04 - Donativos</option>
                        <option>G03 - Gastos en General</option>
                    </select>
                </div>

                <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100 flex justify-end">
                    <button type="button" className="bg-[#0036A0] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 flex items-center gap-2">
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
  );

  // 4. CONTENIDO: HISTORIAL (History)
  const HistoryTab = () => (
    <div className="animate-in fade-in duration-500">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Historial de Donaciones</h2>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Folio</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {/* Fila de Ejemplo 1 */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-sm font-medium text-slate-600">01 Feb 2026</td>
                        <td className="p-4 text-sm font-mono text-slate-500">#36E44616</td>
                        <td className="p-4 text-sm font-bold text-slate-800">$2,500.00</td>
                        <td className="p-4"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"><CheckCircle size={12}/> Completado</span></td>
                        <td className="p-4 text-right">
                            <button className="text-[#0036A0] hover:bg-blue-50 p-2 rounded-lg transition-colors"><Download size={18}/></button>
                        </td>
                    </tr>
                    {/* Fila de Ejemplo 2 */}
                    <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-sm font-medium text-slate-600">15 Ene 2026</td>
                        <td className="p-4 text-sm font-mono text-slate-500">#A2B99012</td>
                        <td className="p-4 text-sm font-bold text-slate-800">$1,000.00</td>
                        <td className="p-4"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit"><CheckCircle size={12}/> Completado</span></td>
                        <td className="p-4 text-right">
                            <button className="text-[#0036A0] hover:bg-blue-50 p-2 rounded-lg transition-colors"><Download size={18}/></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col md:flex-row">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-full md:w-72 bg-[#F8FAFC] md:h-screen md:sticky md:top-0 p-6 border-r border-slate-200 flex flex-col">
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                <img src={logoPrincipal} className="h-8 w-auto" alt="Logo" />
                <div className="flex flex-col leading-none">
                    <span className="font-extrabold text-lg tracking-tight text-slate-800">Becas Tec</span>
                    <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Panel Donantes</span>
                </div>
            </div>

            {/* User Mini Profile */}
            <div className="mb-8 px-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0036A0] text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/20">
                    {user.initials}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-slate-400">Miembro desde {user.joined}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                <SidebarItem id="overview" label="Mi Impacto" icon={Building2} />
                <SidebarItem id="history" label="Historial de Donaciones" icon={History} />
                <SidebarItem id="fiscal" label="Datos Fiscales" icon={FileText} />
                <SidebarItem id="security" label="Seguridad y Cuenta" icon={Settings} />
            </nav>

            {/* Logout */}
            <button className="flex items-center gap-3 px-6 py-3 mt-auto text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-medium">
                <LogOut size={18} /> Cerrar Sesión
            </button>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'history' && <HistoryTab />}
                {activeTab === 'fiscal' && <FiscalTab />}
                {activeTab === 'security' && (
                    <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
                        <Settings size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">Configuración de Cuenta</h3>
                        <p className="text-slate-500 mt-2">Aquí podrás cambiar tu contraseña y preferencias de notificaciones próximamente.</p>
                    </div>
                )}
            </div>
        </main>

    </div>
  );
};

export default AccountPage;