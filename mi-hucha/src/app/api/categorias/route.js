import pool from '../../../lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        const [ingresos] = await pool.query('SELECT * FROM categorias WHERE usuario_id = ? AND tipo="ingreso"',
            [user_id]
        );
        const [gastos] = await pool.query('SELECT * FROM categorias WHERE usuario_id = ? AND tipo="gasto"',
            [user_id]
        );

        return Response.json({ ingresos, gastos });
    }
    catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        const { nombre, tipo } = await request.json();

        if (!nombre || !tipo || (tipo !== 'ingreso' && tipo !== 'gasto')) {
            return Response.json(
                { error: 'Faltan campos obligatorios o tipo inválido' },
                { status: 400 }
            );
        }

        const [result] = await pool.query('INSERT INTO categorias (usuario_id, nombre, tipo) VALUES (?, ?, ?)',
            [user_id, nombre, tipo]);

        return Response.json(
            { id: result.insertId, nombre, tipo, mensaje: 'Categoría creada' },
            { status: 201 }
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
