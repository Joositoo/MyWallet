"use client";
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";
import {
    Wallet,
    TrendingUp,
    PieChart,
    Target,
    Shield,
    BarChart3,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

export default function Welcome() {
    const router = useRouter();

    const features = [
        {
            icon: <Wallet className="h-8 w-8 text-blue-600" />,
            title: "Control Total",
            description:
                "Gestiona todos tus ingresos y gastos en un solo lugar de forma sencilla y organizada.",
        },
        {
            icon: <PieChart className="h-8 w-8 text-green-600" />,
            title: "Visualización Clara",
            description:
                "Gráficos interactivos que te ayudan a entender tus patrones de gasto e ingreso.",
        },
        {
            icon: <Target className="h-8 w-8 text-purple-600" />,
            title: "Categorización",
            description:
                "Organiza tus transacciones por categorías personalizadas para un mejor análisis.",
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
            title: "Reportes Detallados",
            description:
                "Accede a estadísticas y reportes que te muestran tu situación financiera real.",
        },
        {
            icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
            title: "Seguimiento de Balance",
            description:
                "Monitorea tu balance en tiempo real y toma decisiones financieras informadas.",
        },
        {
            icon: <Shield className="h-8 w-8 text-red-600" />,
            title: "Datos Seguros",
            description:
                "Tu información financiera personal está protegida y es completamente privada.",
        },
    ];

    const benefits = [
        "Registra transacciones de forma rápida y sencilla",
        "Visualiza tendencias mensuales de tus finanzas",
        "Identifica áreas donde puedes ahorrar",
        "Establece y monitorea metas financieras",
        "Accede a tu información desde cualquier dispositivo",
        "Sin límite de transacciones o categorías",
    ];

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
<header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
                My Wallet
            </h1>
        </div>
        <div className="flex items-center gap-3">
            <Button
                className="text-gray-900 hover:bg-gray-200  hover:cursor-pointer"
                variant="ghost"
                onClick={() => router.push("/login")}
            >
                Iniciar Sesión
            </Button>
            <Button 
            className="text-white bg-gray-900 hover:bg-gray-900  hover:cursor-pointer"
                onClick={() => router.push("/register")}
                >
                Registrarse
            </Button>
        </div>
    </div>
</header>

{/* Hero Section */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Toma el control de tus finanzas personales WWW
        </h2>
        <p className="text-xl text-gray-600 mb-8">
            Una herramienta simple y poderosa para gestionar tu
            dinero, entender tus hábitos de gasto y alcanzar tus
            objetivos financieros.
        </p>
        <div className="flex items-center justify-center gap-4">
            <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="text-lg px-8 py-6 text-white bg-black hover:bg-gray-900  hover:cursor-pointer"
            >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="text-lg px-8 py-6 bg-white-900 text-gray-900 hover:bg-gray-200  hover:cursor-pointer"
            >
                Ya tengo cuenta
            </Button>
        </div>
    </div>
</section>

{/* Features Grid */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas para gestionar tu dinero
        </h3>
        <p className="text-lg text-gray-600">
            Herramientas diseñadas para hacer tu vida financiera
            más fácil
        </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
            <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
                <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                </h4>
                <p className="text-gray-600">
                    {feature.description}
                </p>
            </div>
        ))}
    </div>
</section>

{/* Benefits Section */}
<section className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    ¿Qué obtienes al registrarte?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                    Al crear tu cuenta gratuita, tendrás acceso
                    inmediato a todas las funcionalidades que te
                    ayudarán a mejorar tu salud financiera.
                </p>
                <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3"
                        >
                            <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-gray-700">{benefit}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">
                    Dashboard en tiempo real
                </h4>
                <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">
                                Ingresos del mes
                            </span>
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <p className="text-3xl font-bold">
                            $3,700.00
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">
                                Gastos del mes
                            </span>
                            <BarChart3 className="h-4 w-4" />
                        </div>
                        <p className="text-3xl font-bold">
                            $1,510.00
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">
                                Balance actual
                            </span>
                            <Wallet className="h-4 w-4" />
                        </div>
                        <p className="text-3xl font-bold">
                            $2,190.00
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{/* CTA Section */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h3 className="text-4xl font-bold mb-4">
            ¿Listo para transformar tus finanzas?
        </h3>
        <p className="text-xl mb-8 opacity-90">
            Únete hoy y comienza a tomar mejores decisiones
            financieras
        </p>
        <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push("/register")}
            className="text-lg px-10 py-6 hover:cursor-pointer"
        >
            Crear mi cuenta gratis
            <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
    </div>
</section>

{/* Footer */}
<footer className="bg-gray-900 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="h-6 w-6" />
            <span className="text-lg font-bold">
                My Wallet
            </span>
        </div>
        <p className="text-gray-400">
            © 2026 My Wallet. Gestiona tu dinero de forma
            inteligente.
        </p>
    </div>
</footer>
</div>
);
}