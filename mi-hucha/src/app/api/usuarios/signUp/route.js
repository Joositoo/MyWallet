import pool from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return Response.json(rows);
}

export async function POST(request) {
    const gastos = ["Comida", "Transporte", "Vivienda", "Ocio"];
    const ingresos = ["Salario", "Otros"];

    try {
        const { nombre, email, password } = await request.json();

        if (!nombre || !email || !password) {
            return Response.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            );
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)', [nombre, email, password_hash]);

        for (const gasto of gastos) {
            await pool.query("INSERT INTO categorias (usuario_id, nombre, tipo) VALUES (?, ?, 'gasto')", [result.insertId, gasto]);
        }

        for (const ingreso of ingresos) {
            await pool.query("INSERT INTO categorias (usuario_id, nombre, tipo) VALUES (?, ?, 'ingreso')", [result.insertId, ingreso]);
        }

        return Response.json(
            { id: result.insertId, nombre, email, mensaje: 'Usuario creado' },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return Response.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}