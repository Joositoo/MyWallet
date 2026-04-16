import pool from '../../../../lib/db';
import { getToken } from 'next-auth/jwt';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { monto, fecha, descripcion, tipo } = await request.json();

        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        if (!monto || !fecha || !descripcion) {
            return Response.json(
                { error: 'Faltan campos obligatorios' },
                {status: 400 }
            );
        }

        switch (tipo) {
            case 'Ingreso':
                await pool.query('UPDATE ingresos SET cantidad = ?, fecha = ?, descripcion = ? WHERE id = ? AND usuario_id = ?',
                    [monto, fecha, descripcion, id, user_id]);
                break;
            case 'Gasto':
                await pool.query('UPDATE gastos SET cantidad = ?, fecha = ?, descripcion = ? WHERE id = ? AND usuario_id = ?',
                    [monto, fecha, descripcion, id, user_id]);
                break;
        }
        return Response.json(
            { mensaje: 'Transacción actualizada' },
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

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const { tipo } = await request.json();
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const user_id = token.id;

        switch (tipo) {
            case 'ingreso':
                await pool.query('DELETE FROM ingresos WHERE id = ? AND usuario_id= ?',
                    [id, user_id]);
                break;
            case 'gasto':
                await pool.query('DELETE FROM gastos WHERE id = ? AND usuario_id= ?',
                    [id, user_id]);
                break;
        }

        return Response.json(
            { mensaje: 'Transacción eliminada' },
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