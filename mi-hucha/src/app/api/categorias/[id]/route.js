import pool from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { nombre, tipo } = await request.json();

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        if (!nombre || !tipo || (tipo !== 'ingreso' && tipo !== 'gasto')) {
            return Response.json(
                { error: 'Faltan campos obligatorios o tipo inválido' },
                { status: 400 }
            );
        }

        await pool.query('UPDATE categorias SET nombre = ?, tipo = ? WHERE id = ? AND usuario_id = ?',
            [nombre, tipo, id, user_id]
        );

        return Response.json(
            { mensaje: 'Categoría actualizada' },
            {status: 200 }
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

export async function DELETE(request, {params }) {
    try {
        const { id } = await params;
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;
        await pool.query('DELETE FROM categorias WHERE id = ? AND usuario_id = ?',
            [id, user_id]
        );

        return Response.json(
            { mensaje: 'Categoría eliminada' },
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