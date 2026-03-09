"use client";
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [correctEmail, setCorrectEmail] = useState(true);
    const [existsUser, setExistsUser] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCorrectEmail(true);
        setExistsUser(true);
        console.log('Login attempt:', { email, password });

        if (!email.endsWith('@gmail.com')){
            setCorrectEmail(false);
            return;
        }

        try {
            const response = await fetch("api/usuarios/login", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok){
                console.error('Login failed:', data);
                setExistsUser(false);
                return;
            }

            console.log("Usuario logueado:", data.usuario);
            return Response.json({
                mensaje: "Login correcto",
                usuario: { id: data.usuario.id, nombre: data.usuario.nombre, email: data.usuario.email }
            }, { status: 200 });
        }
        catch (error){
            console.log("Error de red:", error);
            setExistsUser(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
                    <p className="text-gray-600">Inicia sesión en tu cuenta</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                            Correo electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Iniciar sesión
                    </Button>

                    {!correctEmail && <p className='text-sm text-center font-medium text-red-400'>El correo debe ser @gmail.com</p>}

                    {!existsUser && <p className='text-sm text-center font-medium text-red-400'>Credenciales incorrectas</p>}

                    <div className="text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <a
                            href="/register"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Regístrate
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
