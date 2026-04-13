import pool from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';

export async function PUT(request) {
    try {
        const { nombre } = await request.json();

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        if (!nombre) {
            return Response.json(
                { error: 'Falta el nombre' },
                { status: 400}
            );
        }

        await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?',
            [nombre, user_id]);

        return Response.json(
            { mensaje: 'Nombre actualizado' },
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