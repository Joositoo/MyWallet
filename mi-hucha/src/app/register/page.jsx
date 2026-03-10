"use client";
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

export default function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [correctName, setCorrectName] = useState(true);
    const [correctEmail, setCorrectEmail] = useState(true);
    const [existsUser, setExistsUser] = useState(false);
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{3,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCorrectName(true);
        setCorrectEmail(true);
        setExistsUser(false);

        if (!regex.test(nombre)){
            setCorrectName(false);
            return;
        }

        if (!email.endsWith('@gmail.com')){
            setCorrectEmail(false);
            return;
        }

        try {
            const response = await fetch("api/usuarios/signup", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await response.json();
            if (!response.ok){
                console.error('Signup failed:', data);
                setExistsUser(true);
                return;
            }

            console.log("Usuario registrado:", data);
            return Response.json({
                mensaje: "Registro correcto",
                usuario: { id: data.id, nombre: data.nombre, email: data.email }
            }, { status: 201 });
        }
        catch (error){
            setExistsUser(true);
        }

    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
                    <p className="text-gray-600">Regístrate para comenzar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-900">
                            Nombre
                        </Label>
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-gray-50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                            Correo electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
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
                        Registrarse
                    </Button>

                    {!correctName && <p className='text-sm text-center font-medium text-red-400'>El nombre debe tener al menos 3 caracteres alfabéticos</p>}
                    {!correctEmail && <p className='text-sm text-center font-medium text-red-400'>El correo debe ser @gmail.com</p>}
                    {existsUser && <p className='text-sm text-center font-medium text-red-400'>Correo ya registrado</p>}


                    <div className="text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <a
                            href='/login'
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Inicia sesión
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
