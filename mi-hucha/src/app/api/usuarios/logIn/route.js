import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json(
                { error: "Email y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return Response.json(
                { error: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        const usuario = rows[0];

        const passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordCorrecta) {
            return Response.json(
                { error: "Credenciales incorrectas" },
                { status: 401 }
            );
        }

        return Response.json({
            mensaje: 'Login correcto',
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    }
    catch (error) {
        console.error(error);
        return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}