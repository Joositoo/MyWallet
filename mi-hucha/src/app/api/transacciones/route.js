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

        const [ingresos] = await pool.query('SELECT i.id, i.cantidad, i.descripcion, i.fecha, c.nombre AS categoria FROM ingresos i JOIN categorias c ON i.categoria_id = c.id WHERE i.usuario_id = ?',
            [user_id]);
        const [gastos] = await pool.query('SELECT g.id, g.cantidad, g.descripcion, g.fecha, c.nombre AS categoria FROM gastos g JOIN categorias c ON g.categoria_id = c.id WHERE g.usuario_id = ?',
            [user_id]);

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
        const { tipo, cantidad, categoria, fecha, descripcion } = await request.json();

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        if (!cantidad || !categoria || !fecha || !descripcion) {
            return Response.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        const [rows] = await pool.query('SELECT id FROM categorias WHERE usuario_id = ? AND nombre = ? AND tipo = ?',
            [user_id, categoria, tipo]);
        const categoria_id = rows[0].id;

        let result;
        switch (tipo) {
            case 'ingreso':
                [result] = await pool.query('INSERT INTO ingresos (usuario_id, categoria_id, cantidad, descripcion, fecha) VALUES (?, ?, ?, ?, ?)',
                    [user_id, categoria_id, cantidad, descripcion, fecha]);
                break;
            case 'gasto':
                [result] = await pool.query('INSERT INTO gastos (usuario_id, categoria_id, cantidad, descripcion, fecha) VALUES (?, ?, ?, ?, ?)',
                    [user_id, categoria_id, cantidad, descripcion, fecha]);
                break;
        }

        return Response.json({
            mensaje: 'Transacción creada',
            id: result.insertId
        }, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}