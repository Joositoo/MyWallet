'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { LogOut, Plus, TrendingUp, TrendingDown, Wallet, Pencil, Trash2 } from 'lucide-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { signOut } from 'next-auth/react';

// Datos de ejemplo para las transacciones
const transaccionesEjemplo = [
    { id: 1, tipo: 'ingreso', monto: 3000, categoria: 'Salario', fecha: '2026-03-01', descripcion: 'Salario mensual' },
    { id: 2, tipo: 'gasto', monto: 800, categoria: 'Vivienda', fecha: '2026-03-02', descripcion: 'Renta del mes' },
    { id: 3, tipo: 'gasto', monto: 150, categoria: 'Alimentación', fecha: '2026-03-03', descripcion: 'Supermercado' },
    { id: 4, tipo: 'gasto', monto: 200, categoria: 'Transporte', fecha: '2026-03-04', descripcion: 'Gasolina' },
    { id: 5, tipo: 'ingreso', monto: 500, categoria: 'Freelance', fecha: '2026-03-05', descripcion: 'Proyecto web' },
    { id: 6, tipo: 'gasto', monto: 100, categoria: 'Entretenimiento', fecha: '2026-03-06', descripcion: 'Cine y cena' },
    { id: 7, tipo: 'gasto', monto: 80, categoria: 'Servicios', fecha: '2026-03-07', descripcion: 'Internet' },
    { id: 8, tipo: 'gasto', monto: 120, categoria: 'Alimentación', fecha: '2026-03-08', descripcion: 'Restaurantes' },
    { id: 9, tipo: 'gasto', monto: 60, categoria: 'Salud', fecha: '2026-03-09', descripcion: 'Farmacia' },
    { id: 10, tipo: 'ingreso', monto: 200, categoria: 'Inversiones', fecha: '2026-03-10', descripcion: 'Dividendos' },
];

// Datos por categoría para gráfico de pastel
const gastosPorCategoria = [
    { nombre: 'Vivienda', valor: 800 },
    { nombre: 'Alimentación', valor: 270 },
    { nombre: 'Transporte', valor: 200 },
    { nombre: 'Entretenimiento', valor: 100 },
    { nombre: 'Servicios', valor: 80 },
    { nombre: 'Salud', valor: 60 },
];

const COLORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function Dashboard() {
    const navigate = useRouter();
    const [nuevoNombreEmpty, setNuevoNombreEmpty] = useState(false);
    const [emptyCategory, setEmptyCategory] = useState(false);
    const [emptyTransaction, setEmptyTransaction] = useState(false);
    const [emptyEditedCategory, setEmptyEditedCategory] = useState(false);
    const [emptyEditTransaction, setEmptyEditTransaction] = useState(false);
    const [transacciones, setTransacciones] = useState(transaccionesEjemplo);
    const [nuevaTransaccion, setNuevaTransaccion] = useState({
        tipo: 'ingreso',
        monto: '',
        categoria: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
    });
    const [categorias, setCategorias] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [datosMensuales, setDatosMensuales] = useState([]);

    // Estado para perfil de usuario
    const [usuario, setUsuario] = useState({
        nombre: '',
    });

    useEffect(() => {
        const cargarCategorias = async () => {
            const res = await fetch('/api/categorias');
            const data = await res.json();
            setCategorias([...data.ingresos, ...data.gastos]);
        };

        const cargarPerfil = async () => {
            const res = await fetch('/api/perfil');
            const data = await res.json();
            setUsuario({ nombre: data.perfil.nombre });
        };

        const cargarTransacciones = async () => {
            const res = await fetch('/api/transacciones/');
            const data = await res.json();
            console.log(data);
            setIngresos(data.ingresos.map(t => ({ ...t, tipo: 'Ingreso' })));
            setGastos(data.gastos.map(t => ({ ...t, tipo: 'Gasto' })));
            setDatosMensuales(data.datosMensuales);
        };

        cargarCategorias();
        cargarPerfil();
        cargarTransacciones();
    }, []);

    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre: '',
        tipo: 'ingreso',
    });
    const [categoriaEditando, setCategoriaEditando] = useState([]);
    const [dialogCategoriaAbierto, setDialogCategoriaAbierto] = useState(false);

    const [editandoPerfil, setEditandoPerfil] = useState({
        nombre: '',
        passwordActual: '',
        passwordNueva: '',
        passwordRepetir: '',
    });
    const [errorPassword, setErrorPassword] = useState('');

    // Estado para editar transacciones
    const [transaccionEditando, setTransaccionEditando] = useState(null);
    const [dialogTransaccionAbierto, setDialogTransaccionAbierto] = useState(false);

    // Calcular totales
    const totalIngresos = transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((acc, t) => acc + t.monto, 0);

    const totalGastos = transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((acc, t) => acc + t.monto, 0);

    const balance = totalIngresos - totalGastos;

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    //***********************************************************************************************************************************************/
    // FUNCIONES PARA CATEGORÍAS
    const agregarCategoria = async () => {
        setEmptyCategory(false);
        if (!nuevaCategoria.nombre.trim()) {
            setEmptyCategory(true);
            return;
        }
        const res = await fetch('/api/categorias', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(nuevaCategoria)
        })

        if (res.ok) {
            const data = await res.json();
            setCategorias([...categorias, { id: data.id, nombre: data.nombre, tipo: data.tipo }]);
        }
    };

    const abrirEditarCategoria = (categoria) => {
        setCategoriaEditando({ ...categoria });
        setDialogCategoriaAbierto(true);
    };

    const guardarCategoriaEditada = async (categoria) => {
        setEmptyEditedCategory(false);
        if (!categoriaEditando.nombre.trim()) {
            setEmptyEditedCategory(true);
            return;
        }

        const res = await fetch('/api/categorias/' + categoria.id, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(categoriaEditando)
        })

        if (res.ok) {
            const data = await res.json();
            setCategorias(categorias.map(c => c.id === categoria.id ? { ...c, ...categoriaEditando } : c
            ));
            setDialogCategoriaAbierto(false);
        }
    };

    const eliminarCategoria = async (id) => {
        const res = await fetch('/api/categorias/' + id, {
            method: 'DELETE'
        });

        if (res.ok) {
            setCategorias(categorias.filter(c => c.id !== id));
        }
    };

    //***********************************************************************************************************************************************/

    //***********************************************************************************************************************************************/
    // FUNCIONES PARA PERFIL
    const actualizarNombre = async () => {
        setNuevoNombreEmpty(false);
        if (!editandoPerfil.nombre.trim()) {
            setNuevoNombreEmpty(true);
            return;
        }

        await fetch('/api/perfil/nombre', {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ nombre: editandoPerfil.nombre })
        });
        setUsuario({ ...usuario, nombre: editandoPerfil.nombre.trim() });
        setEditandoPerfil({ ...editandoPerfil, nombre: '' });
    };

    const cambiarPassword = async () => {
        setErrorPassword('');

        if (!editandoPerfil.passwordActual || !editandoPerfil.passwordNueva || !editandoPerfil.passwordRepetir) {
            setErrorPassword('Todos los campos de contraseña son obligatorios');
            return;
        }

        if (editandoPerfil.passwordNueva !== editandoPerfil.passwordRepetir) {
            setErrorPassword('Las contraseñas nuevas no coinciden.');
            return;
        }

        const res = await fetch('/api/perfil/password', {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                passwordActual: editandoPerfil.passwordActual,
                passwordNueva: editandoPerfil.passwordNueva
            })
        });

        if (res.status === 401) {
            setErrorPassword('La contraseña actual es incorrecta');
            return;
        }

        setUsuario({ ...usuario, password: editandoPerfil.passwordNueva });
        setEditandoPerfil({
            ...editandoPerfil,
            passwordActual: '',
            passwordNueva: '',
            passwordRepetir: '',
        });
        setErrorPassword('');
        alert('Contraseña cambiada exitosamente');
    };

    //***********************************************************************************************************************************************/

    //***********************************************************************************************************************************************/
    // FUNCIONES PARA TRANSACCIONES
    const agregarTransaccion = async () => {
        setEmptyTransaction(false);

        if (!nuevaTransaccion.monto || !nuevaTransaccion.descripcion || !nuevaTransaccion.fecha) {
            setEmptyTransaction(true);
            return;
        }

        const res = await fetch('/api/transacciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: nuevaTransaccion.tipo,
                categoria: nuevaTransaccion.categoria,
                cantidad: nuevaTransaccion.monto,
                descripcion: nuevaTransaccion.descripcion,
                fecha: nuevaTransaccion.fecha
            })
        });

        if (res.ok) {
            const data = await res.json();
            const nuevaEntrada = {
                id: data.id,
                cantidad: nuevaTransaccion.monto,
                descripcion: nuevaTransaccion.descripcion,
                fecha: nuevaTransaccion.fecha,
                categoria: nuevaTransaccion.categoria
            };

            if (nuevaTransaccion.tipo === 'ingreso') {
                setIngresos([...ingresos, nuevaEntrada]);
            } else {
                setGastos([...gastos, nuevaEntrada]);
            }

            setNuevaTransaccion({
                tipo: 'ingreso',
                monto: '',
                categoria: '',
                descripcion: '',
                fecha: new Date().toISOString().split('T')[0],
            });
        }
    };

    const abrirEditarTransaccion = (transaccion) => {
        setTransaccionEditando({
            id: transaccion.id,
            tipo: transaccion.tipo,
            monto: transaccion.cantidad,
            categoria: transaccion.categoria,
            fecha: new Date(transaccion.fecha).toLocaleDateString('en-CA'),
            descripcion: transaccion.descripcion
        });
        setDialogTransaccionAbierto(true);
    };

    const guardarTransaccionEditada = async () => {
        setEmptyEditTransaction(false);
        if (!transaccionEditando.monto || !transaccionEditando.fecha || !transaccionEditando.descripcion) {
            setEmptyEditTransaction(true);
            return;
        }

        const res = await fetch('/api/transacciones/' + transaccionEditando.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaccionEditando)
        })

        if (res.ok) {
            if (transaccionEditando.tipo === 'Ingreso') {
                setIngresos(ingresos.map(t =>
                    t.id === transaccionEditando.id
                        ? { ...t, cantidad: transaccionEditando.monto, fecha: transaccionEditando.fecha, descripcion: transaccionEditando.descripcion }
                        : t
                ));
            } else {
                setGastos(gastos.map(t =>
                    t.id === transaccionEditando.id
                        ? { ...t, cantidad: transaccionEditando.monto, fecha: transaccionEditando.fecha, descripcion: transaccionEditando.descripcion }
                        : t
                ));
            }
            setDialogTransaccionAbierto(false);
        }
    };

    const eliminarTransaccion = async (id, tipo) => {
        const res = await fetch('/api/transacciones/' + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo })
        })
        if (res.ok) {
            if (tipo === 'ingreso') {
                setIngresos(ingresos.filter(t => t.id !== id));
            } else {
                setGastos(gastos.filter(t => t.id !== id));
            }
        }
    };

    //***********************************************************************************************************************************************/



    return (
        <div className="min-h-screen w-full bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Financiero</h1>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:bg-gray-200 hover:cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="resumen" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-200">
                        <TabsTrigger value="resumen">Resumen</TabsTrigger>
                        <TabsTrigger value="perfil">Perfil</TabsTrigger>
                        <TabsTrigger value="transacciones">Gastos e Ingresos</TabsTrigger>
                        <TabsTrigger value="categorias">Categorías</TabsTrigger>
                    </TabsList>

                    {/* Resumen Tab */}
                    <TabsContent value="resumen" className="space-y-6">
                        {/* Cards de resumen */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Ingresos</p>
                                        <p className="text-3xl font-bold text-green-600"> Hola{/*${totalIngresos.toFixed(2)}*/}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Gastos</p>
                                        <p className="text-3xl font-bold text-red-600">${totalGastos.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-red-100 p-3 rounded-full">
                                        <TrendingDown className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Balance</p>
                                        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                            ${balance.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <Wallet className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gráficos */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Gráfico de Tendencia */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Tendencia Mensual</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={datosMensuales}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" tickFormatter={(mes) => new Date(mes + "-01").toLocaleDateString('es-ES', { month: 'long' })} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="ingresos"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            name="Ingresos"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="gastos"
                                            stroke="#ef4444"
                                            strokeWidth={3}
                                            name="Gastos"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Gráfico de Distribución por Categoría */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Gastos por Categoría</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={gastosPorCategoria}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="valor"
                                        >
                                            {gastosPorCategoria.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Transacciones Recientes */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Transacciones Recientes</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Ingresos */}
                                <div>
                                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Ingresos ({transacciones.slice(-5).filter(t => t.tipo === 'ingreso').length})
                                    </h4>
                                    <div className="space-y-2">
                                        {transacciones
                                            .slice(-5)
                                            .reverse()
                                            .filter(t => t.tipo === 'ingreso')
                                            .map((transaccion) => (
                                                <div
                                                    key={transaccion.id}
                                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{transaccion.descripcion}</p>
                                                        <p className="text-sm text-gray-500">{transaccion.categoria} • {transaccion.fecha}</p>
                                                    </div>
                                                    <div className="font-bold text-green-600">
                                                        {/*+${transaccion.monto.toFixed(2)}*/} Hola2
                                                    </div>
                                                </div>
                                            ))}
                                        {transacciones.slice(-5).filter(t => t.tipo === 'ingreso').length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">No hay ingresos recientes</p>
                                        )}
                                    </div>
                                </div>

                                {/* Gastos */}
                                <div>
                                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                        <TrendingDown className="h-4 w-4" />
                                        Gastos ({transacciones.slice(-5).filter(t => t.tipo === 'gasto').length})
                                    </h4>
                                    <div className="space-y-2">
                                        {transacciones
                                            .slice(-5)
                                            .reverse()
                                            .filter(t => t.tipo === 'gasto')
                                            .map((transaccion) => (
                                                <div
                                                    key={transaccion.id}
                                                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{transaccion.descripcion}</p>
                                                        <p className="text-sm text-gray-500">{transaccion.categoria} • {transaccion.fecha}</p>
                                                    </div>
                                                    <div className="font-bold text-red-600">
                                                        -${transaccion.monto.toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        {transacciones.slice(-5).filter(t => t.tipo === 'gasto').length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">No hay gastos recientes</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Perfil Tab */}
                    <TabsContent value="perfil" className="space-y-6">
                        {/* Información del Usuario */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Mi Perfil</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Nombre de usuario</p>
                                        <p className="text-lg font-semibold text-gray-900">{usuario.nombre}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modificar Nombre */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Cambiar Nombre</h3>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="nuevoNombre">Nuevo nombre</Label>
                                    <Input
                                        id="nuevoNombre"
                                        type="text"
                                        placeholder="Ingrese su nuevo nombre"
                                        value={editandoPerfil.nombre}
                                        onChange={(e) => setEditandoPerfil({ ...editandoPerfil, nombre: e.target.value })}
                                    />
                                    {nuevoNombreEmpty && <p className='mt-5 text-red-400'>El nombre no puede estar vacío.</p>}
                                </div>
                                <Button className="hover:cursor-pointer hover:bg-gray-200" onClick={actualizarNombre}>
                                    Actualizar Nombre
                                </Button>
                            </div>
                        </div>

                        {/* Cambiar Contraseña */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Cambiar Contraseña</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="passwordActual">Contraseña actual</Label>
                                    <Input
                                        id="passwordActual"
                                        type="password"
                                        placeholder="Ingrese su contraseña actual"
                                        value={editandoPerfil.passwordActual}
                                        onChange={(e) => setEditandoPerfil({ ...editandoPerfil, passwordActual: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passwordNueva">Nueva contraseña</Label>
                                    <Input
                                        id="passwordNueva"
                                        type="password"
                                        placeholder="Ingrese su nueva contraseña"
                                        value={editandoPerfil.passwordNueva}
                                        onChange={(e) => setEditandoPerfil({ ...editandoPerfil, passwordNueva: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passwordRepetir">Repetir nueva contraseña</Label>
                                    <Input
                                        id="passwordRepetir"
                                        type="password"
                                        placeholder="Repita su nueva contraseña"
                                        value={editandoPerfil.passwordRepetir}
                                        onChange={(e) => setEditandoPerfil({ ...editandoPerfil, passwordRepetir: e.target.value })}
                                    />
                                </div>
                                {errorPassword && (

                                    <p className="mt-5 text-red-400">{errorPassword}</p>

                                )}
                                <Button onClick={cambiarPassword} className="w-full md:w-auto hover:cursor-pointer hover:bg-gray-200">
                                    Cambiar Contraseña
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Gastos e Ingresos Tab */}
                    <TabsContent value="transacciones" className="space-y-6">
                        {/* Gráfico de Barras */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Comparación Ingresos vs Gastos</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={datosMensuales}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" tickFormatter={(mes) => new Date(mes + "-01").toLocaleDateString('es-ES', { month: 'long' })} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
                                    <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Formulario para agregar transacciones */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Agregar Transacción</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo">Tipo</Label>
                                    <select
                                        id="tipo"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={nuevaTransaccion.tipo}
                                        onChange={(e) => setNuevaTransaccion({ ...nuevaTransaccion, tipo: e.target.value })}
                                    >
                                        <option value="ingreso">Ingreso</option>
                                        <option value="gasto">Gasto</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="monto">Cantidad</Label>
                                    <Input
                                        id="monto"
                                        type="number"
                                        placeholder="0.00"
                                        value={nuevaTransaccion.monto}
                                        onChange={(e) => setNuevaTransaccion({ ...nuevaTransaccion, monto: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="categoria">Categoría</Label>
                                    <select
                                        id="categoria"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={nuevaTransaccion.categoria}
                                        onChange={(e) => setNuevaTransaccion({ ...nuevaTransaccion, categoria: e.target.value })}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias
                                            .filter(cat => cat.tipo === nuevaTransaccion.tipo)
                                            .map((categoria) => (
                                                <option key={categoria.id} value={categoria.nombre}>
                                                    {categoria.nombre}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fecha">Fecha</Label>
                                    <Input
                                        id="fecha"
                                        type="date"
                                        value={nuevaTransaccion.fecha}
                                        onChange={(e) => setNuevaTransaccion({ ...nuevaTransaccion, fecha: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Input
                                        id="descripcion"
                                        type="text"
                                        placeholder="Descripción de la transacción"
                                        value={nuevaTransaccion.descripcion}
                                        onChange={(e) => setNuevaTransaccion({ ...nuevaTransaccion, descripcion: e.target.value })}
                                    />
                                </div>
                            </div>

                            {emptyTransaction && <p className='mt-5 text-red-400'>Ningún campo debe quedar vacío.</p>}
                            <Button onClick={agregarTransaccion} className="w-full md:w-auto hover:bg-gray-200 hover:cursor-pointer">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Transacción
                            </Button>
                        </div>

                        {/* Lista de todas las transacciones */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Todas las Transacciones</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Ingresos */}
                                <div>
                                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Ingresos ({ingresos.length})
                                    </h4>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {ingresos
                                            .map((ingreso) => (
                                                <div
                                                    key={ingreso.id}
                                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{ingreso.descripcion}</p>
                                                        <p className="text-sm text-gray-500 truncate">{ingreso.categoria} • {new Date(ingreso.fecha).toLocaleDateString('es-ES')}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <div className="font-bold text-green-600 whitespace-nowrap">
                                                            +{ingreso.cantidad} €
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => abrirEditarTransaccion(ingreso)}
                                                                className="h-7 w-7 p-0 h hover:cursor-pointer"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => eliminarTransaccion(ingreso.id, 'ingreso')}
                                                                className="h-7 w-7 p-0 hover:cursor-pointer"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {ingresos.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">No hay ingresos registrados</p>
                                        )}
                                    </div>
                                </div>

                                {/* Gastos */}
                                <div>
                                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                        <TrendingDown className="h-4 w-4" />
                                        Gastos ({gastos.length})
                                    </h4>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {gastos
                                            .map((gasto) => (
                                                <div
                                                    key={gasto.id}
                                                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{gasto.descripcion}</p>
                                                        <p className="text-sm text-gray-500 truncate">{gasto.categoria} • {new Date(gasto.fecha).toLocaleDateString('es-ES')}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <div className="font-bold text-red-600 whitespace-nowrap">
                                                            -{gasto.cantidad} €
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => abrirEditarTransaccion(gasto)}
                                                                className="h-7 w-7 p-0 hover:cursor-pointer"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => eliminarTransaccion(gasto.id, 'gasto')}
                                                                className="h-7 w-7 p-0 hover:cursor-pointer"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {transacciones.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">No hay gastos registrados</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dialog para editar transacción */}
                        <Dialog open={dialogTransaccionAbierto} onOpenChange={setDialogTransaccionAbierto}>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Editar Transacción</DialogTitle>
                                </DialogHeader>
                                {transaccionEditando && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="editTipo">Tipo</Label>
                                            <Input
                                                id="editTipo"
                                                type="text"
                                                value={transaccionEditando.tipo}
                                                readOnly
                                                onChange={(e) => setTransaccionEditando({ ...transaccionEditando, tipo: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editMonto">Monto</Label>
                                            <Input
                                                id="editMonto"
                                                type="number"
                                                value={transaccionEditando.monto}
                                                onChange={(e) => setTransaccionEditando({ ...transaccionEditando, monto: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editCategoria">Categoría</Label>
                                            <Input
                                                id="editCategoria"
                                                type="text"
                                                value={transaccionEditando.categoria}
                                                readOnly
                                                onChange={(e) => setTransaccionEditando({ ...transaccionEditando, categoria: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editFecha">Fecha</Label>
                                            <Input
                                                id="editFecha"
                                                type="date"
                                                value={transaccionEditando.fecha}
                                                onChange={(e) => setTransaccionEditando({ ...transaccionEditando, fecha: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="editDescripcion">Descripción</Label>
                                            <Input
                                                id="editDescripcion"
                                                type="text"
                                                value={transaccionEditando.descripcion}
                                                onChange={(e) => setTransaccionEditando({ ...transaccionEditando, descripcion: e.target.value })}
                                            />
                                        </div>
                                        {emptyEditTransaction && <p className='text-red-400 col-span-2'>Ningún campo debe quedar vacío.</p>}
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button className="hover:cursor-pointer hover:bg-gray-200" variant="outline" onClick={() => setDialogTransaccionAbierto(false)}>
                                        Cancelar
                                    </Button>
                                    <Button className="hover:cursor-pointer hover:bg-gray-200" onClick={guardarTransaccionEditada}>
                                        Guardar Cambios
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Categorías Tab */}
                    <TabsContent value="categorias" className="space-y-6">
                        {/* Formulario para agregar categorías */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Agregar Categoría</h3>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="nombreCategoria">Nombre de la categoría</Label>
                                    <Input
                                        id="nombreCategoria"
                                        type="text"
                                        placeholder="Ej: Educación"
                                        value={nuevaCategoria.nombre}
                                        onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="w-48 space-y-2">
                                    <Label htmlFor="tipoCategoria">Tipo</Label>
                                    <select
                                        id="tipoCategoria"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={nuevaCategoria.tipo}
                                        onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, tipo: e.target.value })}
                                    >
                                        <option value="ingreso">Ingreso</option>
                                        <option value="gasto">Gasto</option>
                                    </select>
                                </div>
                                <Button onClick={agregarCategoria} className="hover:cursor-pointer hover:bg-gray-200">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar
                                </Button>
                            </div>
                            {emptyCategory && <p className='mt-5 text-red-400'>Indica el nombre de la categoría.</p>}
                        </div>

                        {/* Lista de categorías */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Mis Categorías</h3>

                            {/* Categorías de Ingresos */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Ingresos
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categorias.filter(c => c.tipo === 'ingreso').map((categoria) => (
                                        <div
                                            key={categoria.id}
                                            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-900">{categoria.nombre}</span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => abrirEditarCategoria(categoria)}
                                                    className="h-8 w-8 p-0 hover:cursor-pointer"
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => eliminarCategoria(categoria.id)}
                                                    className="h-8 w-8 p-0 hover:cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Categorías de Gastos */}
                            <div>
                                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4" />
                                    Gastos
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categorias.filter(c => c.tipo === 'gasto').map((categoria) => (
                                        <div
                                            key={categoria.id}
                                            className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-900">{categoria.nombre}</span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => abrirEditarCategoria(categoria)}
                                                    className="h-8 w-8 p-0 hover:cursor-pointer"
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => eliminarCategoria(categoria.id)}
                                                    className="h-8 w-8 p-0 hover:cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Dialog para editar categoría */}
                        <Dialog open={dialogCategoriaAbierto} onOpenChange={setDialogCategoriaAbierto}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Editar Categoría</DialogTitle>
                                </DialogHeader>
                                {categoriaEditando && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="editNombreCategoria">Nombre de la categoría</Label>
                                            <Input
                                                id="editNombreCategoria"
                                                type="text"
                                                value={categoriaEditando.nombre}
                                                onChange={(e) => setCategoriaEditando({ ...categoriaEditando, nombre: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="editTipoCategoria">Tipo</Label>
                                            <select
                                                id="editTipoCategoria"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                value={categoriaEditando.tipo}
                                                onChange={(e) => setCategoriaEditando({ ...categoriaEditando, tipo: e.target.value })}
                                            >
                                                <option value="gasto">Gasto</option>
                                                <option value="ingreso">Ingreso</option>
                                            </select>
                                        </div>
                                        {emptyEditedCategory && <p className='mt-5 text-red-400'>Indica el nombre de la categoría.</p>}
                                    </div>

                                )}
                                <DialogFooter>
                                    <Button className='hover:cursor-pointer hover:bg-gray-200' variant="outline" onClick={() => setDialogCategoriaAbierto(false)}>
                                        Cancelar
                                    </Button>
                                    <Button className='hover:cursor-pointer hover:bg-gray-200' onClick={() => guardarCategoriaEditada(categoriaEditando)}>
                                        Guardar Cambios
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}