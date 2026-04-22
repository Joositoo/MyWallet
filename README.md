# 💰 My Wallet — Gestor de Finanzas Personales

My Wallet es una aplicación web de gestión de finanzas personales construida con **Next.js**. Permite a los usuarios registrar sus ingresos y gastos, organizarlos por categorías, y visualizar su situación financiera a través de gráficos interactivos.

---

## ✨ Características

- ✅ Registro e inicio de sesión de usuarios con autenticación segura
- ✅ Gestión completa de categorías (ingresos y gastos) con CRUD completo
- ✅ Registro de transacciones (ingresos y gastos) con categoría, fecha y descripción
- ✅ Edición y eliminación de transacciones en tiempo real
- ✅ Dashboard con resumen financiero
- ✅ Gráfico de barras comparando ingresos vs gastos por mes
- ✅ Gráfico de tarta con gastos por categoría
- ✅ Perfil de usuario con cambio de nombre y contraseña
- ✅ Rutas protegidas — solo accesibles con sesión activa
- ✅ Categorías por defecto creadas automáticamente al registrarse

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework fullstack (frontend + backend) |
| [React](https://react.dev/) | Interfaz de usuario |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos |
| [NextAuth.js](https://next-auth.js.org/) | Autenticación y gestión de sesiones |
| [MySQL](https://www.mysql.com/) | Base de datos relacional |
| [mysql2](https://www.npmjs.com/package/mysql2) | Driver de conexión a MySQL |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Hasheo de contraseñas |
| [Recharts](https://recharts.org/) | Gráficos interactivos |

---

## 📁 Estructura del Proyecto

```
my-wallet/
├── src/
│   ├── app/
│   │   ├── api/                          ← Backend (rutas API)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.js          ← Configuración NextAuth
│   │   │   ├── categorias/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js          ← PUT, DELETE /api/categorias/:id
│   │   │   │   └── route.js              ← GET, POST /api/categorias
│   │   │   ├── perfil/
│   │   │   │   ├── nombre/
│   │   │   │   │   └── route.js          ← PUT /api/perfil/nombre
│   │   │   │   ├── password/
│   │   │   │   │   └── route.js          ← PUT /api/perfil/password
│   │   │   │   └── route.js              ← GET /api/perfil
│   │   │   ├── transacciones/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js          ← PUT, DELETE /api/transacciones/:id
│   │   │   │   └── route.js              ← GET, POST /api/transacciones
│   │   │   └── usuarios/
│   │   │       ├── login/
│   │   │       │   └── route.js          ← POST /api/usuarios/login
│   │   │       └── signup/
│   │   │           └── route.js          ← POST /api/usuarios/signup
│   │   ├── dashboard/
│   │   │   └── page.jsx                  ← Dashboard principal
│   │   ├── login/
│   │   │   └── page.jsx                  ← Página de inicio de sesión
│   │   ├── register/
│   │   │   └── page.jsx                  ← Página de registro
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js                     ← Layout global con SessionProvider
│   │   └── page.js                       ← Página raíz
│   ├── components/                       ← Componentes reutilizables
│   ├── lib/
│   │   └── db.js                         ← Conexión a MySQL (pool)
│   └── styles/
├── middleware.js                          ← Protección de rutas
├── .env.local                             ← Variables de entorno (no subir a Git)
└── package.json
```

---

## 🗄️ Base de Datos

La base de datos se llama `mihucha` y tiene 4 tablas:

### `usuarios`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INT AUTO_INCREMENT | Clave primaria |
| nombre | VARCHAR(100) | Nombre del usuario |
| email | VARCHAR(150) UNIQUE | Email único |
| password_hash | VARCHAR(255) | Contraseña hasheada con bcrypt |
| fecha_alta | DATETIME | Fecha de registro (default: now) |

### `categorias`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INT AUTO_INCREMENT | Clave primaria |
| usuario_id | INT | FK → usuarios.id |
| nombre | VARCHAR(100) | Nombre de la categoría |
| tipo | ENUM('ingreso','gasto') | Tipo de categoría |

### `ingresos`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INT AUTO_INCREMENT | Clave primaria |
| usuario_id | INT | FK → usuarios.id |
| categoria_id | INT | FK → categorias.id |
| cantidad | DECIMAL(10,2) | Cantidad del ingreso |
| descripcion | VARCHAR(255) | Descripción |
| fecha | DATE | Fecha del ingreso |

### `gastos`
| Campo | Tipo | Descripción |
|---|---|---|
| id | INT AUTO_INCREMENT | Clave primaria |
| usuario_id | INT | FK → usuarios.id |
| categoria_id | INT | FK → categorias.id |
| cantidad | DECIMAL(10,2) | Cantidad del gasto |
| descripcion | VARCHAR(255) | Descripción |
| fecha | DATE | Fecha del gasto |

---

## 🚀 Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- MySQL o MariaDB en ejecución
- La base de datos `mihucha` creada con las tablas del esquema

### Pasos

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/MyWallet.git
cd MyWallet
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea el archivo `.env.local` en la raíz (ver sección siguiente)

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

---

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=mihucha

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=una_clave_secreta_larga_y_segura
```

---

## 📡 Rutas de la API

Todas las rutas (excepto login y signup) requieren sesión activa. El token se verifica automáticamente desde la cookie de NextAuth.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/usuarios/login` | Iniciar sesión |
| POST | `/api/usuarios/signup` | Registrar nuevo usuario |
| GET/POST | `/api/auth/[...nextauth]` | Gestión de sesión NextAuth |

### Categorías

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Obtener categorías del usuario |
| POST | `/api/categorias` | Crear nueva categoría |
| PUT | `/api/categorias/:id` | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría |

### Transacciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/transacciones` | Obtener ingresos y gastos del usuario |
| POST | `/api/transacciones` | Crear nueva transacción |
| PUT | `/api/transacciones/:id` | Actualizar transacción |
| DELETE | `/api/transacciones/:id` | Eliminar transacción |

### Perfil

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/perfil` | Obtener perfil del usuario |
| PUT | `/api/perfil/nombre` | Actualizar nombre |
| PUT | `/api/perfil/password` | Cambiar contraseña |

---

## 📄 Páginas

| Ruta | Descripción | Protegida |
|---|---|---|
| `/login` | Inicio de sesión | ❌ |
| `/register` | Registro de usuario | ❌ |
| `/dashboard` | Panel principal con gráficos y transacciones | ✅ |

---

## 🔒 Autenticación

La autenticación está implementada con **NextAuth.js** usando el proveedor `CredentialsProvider`:

1. El usuario introduce email y contraseña
2. NextAuth busca el usuario en la BD por email
3. Compara la contraseña con el hash usando `bcrypt.compare`
4. Si es correcta, crea una sesión con `id`, `name` y `email`
5. La sesión se guarda en una cookie segura automáticamente

Al registrarse, el flujo es:
1. Se crea el usuario con la contraseña hasheada (`bcrypt.hash`)
2. Se crean categorías por defecto automáticamente
3. Se inicia sesión automáticamente con `signIn`
4. Se redirige al dashboard

---

## 🛡️ Seguridad

- Las contraseñas nunca se guardan en texto plano — se hashean con **bcrypt** (10 rondas)
- Las credenciales de la BD están en `.env.local`, nunca en el código
- Todas las queries usan **placeholders** (`?`) para prevenir inyección SQL
- Las rutas del dashboard están protegidas por **middleware** de NextAuth
- Cada usuario solo puede acceder a sus propios datos gracias al filtrado por `usuario_id` en todas las queries
- El `password_hash` nunca se devuelve en ninguna respuesta de la API

---
