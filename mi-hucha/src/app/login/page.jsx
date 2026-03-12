"use client";
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [correctEmail, setCorrectEmail] = useState(true);
    const [existsUser, setExistsUser] = useState(true);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCorrectEmail(true);
        setExistsUser(true);

        if (!email.endsWith('@gmail.com')){
            setCorrectEmail(false);
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        if (result.error){
            setExistsUser(false);
            return;
        }

        router.push("/dashboard");
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white  hover:cursor-pointer"
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
