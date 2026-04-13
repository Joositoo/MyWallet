import pool from '../../../lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token){
            return Response.json(
                { error: 'No autorizado' },
                { status: 401}
            );
        }

        const user_id = token.id

        const [perfil] = await pool.query('SELECT id, nombre, email, fecha_alta FROM usuarios WHERE id = ?',
            [user_id]
        );

        return Response.json({ perfil: perfil[0] });
    }
    catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}