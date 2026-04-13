import pool from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
    try {
        const { passwordActual, passwordNueva } = await request.json();

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        
        if (!passwordActual || !passwordNueva) {
            return Response.json(
                { error: 'Faltan campos' }, 
                { status: 400 });
        }

        const [rows] = await pool.query('SELECT password_hash FROM usuarios WHERE id = ?',
            [user_id]);

        const usersPassword = rows[0].password_hash;

        const samePassword = await bcrypt.compare(passwordActual, usersPassword);
        if (!samePassword) {
            return Response.json(
                { error: 'Contraseña actual incorrecta' }, 
                { status: 401 });
        }

        await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?',
            [await bcrypt.hash(passwordNueva, 10), user_id]);

        return Response.json(
            { mensaje: 'Contraseña actualizada' },
            { status: 200 }
        );
    }
    catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}