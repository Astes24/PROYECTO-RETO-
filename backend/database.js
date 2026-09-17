import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

let db;

// Guardar la BD en disco (solo en local)
function saveDatabase() {
  if (isVercel || !db) return;
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, 'clinica.db');
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (e) {
    console.warn('No se pudo guardar la BD en disco:', e.message);
  }
}

// Inicializar la base de datos
async function initDatabase() {
  if (db) return db; // Ya inicializada (warm start en Vercel)

  const SQL = await initSqlJs();

  // En local, intentar cargar desde archivo
  if (!isVercel) {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dbPath = path.join(__dirname, 'data', 'clinica.db');
      if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
        console.log('✅ Base de datos cargada desde archivo:', dbPath);
        return db;
      }
    } catch (e) {
      console.warn('No se pudo cargar BD desde archivo, creando nueva...');
    }
  }

  // Crear BD nueva (en memoria)
  db = new SQL.Database();

  // Crear tablas
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT NOT NULL UNIQUE,
      email TEXT,
      fuente TEXT DEFAULT 'whatsapp',
      estado TEXT DEFAULT 'nuevo',
      notas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      fecha DATE NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      motivo TEXT NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      notas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mensajes_whatsapp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      telefono TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      direccion TEXT DEFAULT 'entrante',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);

  // Insertar datos semilla
  seedDatabase();
  saveDatabase();

  console.log('✅ Base de datos inicializada' + (isVercel ? ' (in-memory, Vercel)' : ' (local)'));
  return db;
}

function seedDatabase() {
  const result = db.exec('SELECT COUNT(*) as count FROM leads');
  const countLeads = result[0]?.values[0][0] || 0;
  if (countLeads > 0) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const dateToday = formatDate(today);
  const dateTomorrow = formatDate(tomorrow);

  // 6 Leads ficticios latinoamericanos
  const leadsData = [
    ['Juan Pérez', '+525551234567', 'juan.perez@example.com', 'whatsapp', 'nuevo', 'Paciente interesado en consulta general'],
    ['María García', '+573001234567', 'maria.garcia@example.com', 'web', 'contactado', 'Requiere revisión odontológica'],
    ['Carlos López', '+5491112345678', 'carlos.lopez@example.com', 'whatsapp', 'nuevo', 'Pregunta por precios'],
    ['Ana Martínez', '+56912345678', 'ana.martinez@example.com', 'referido', 'contactado', 'Viene recomendada por otro paciente'],
    ['Luis Rodríguez', '+51987654321', 'luis.rodriguez@example.com', 'whatsapp', 'convertido', 'Ya agendó cita'],
    ['Sofía Fernández', '+593987654321', 'sofia.fernandez@example.com', 'instagram', 'nuevo', 'Consulta por Instagram']
  ];

  const leadIds = [];
  for (const [nombre, telefono, email, fuente, estado, notas] of leadsData) {
    db.run(
      'INSERT INTO leads (nombre, telefono, email, fuente, estado, notas) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, telefono, email, fuente, estado, notas]
    );
    const idResult = db.exec('SELECT last_insert_rowid()');
    leadIds.push(idResult[0].values[0][0]);
  }

  // 5 Citas (hoy y mañana)
  const citasData = [
    [leadIds[0], dateToday, '10:00', '10:30', 'Consulta Inicial', 'pendiente', ''],
    [leadIds[1], dateToday, '11:00', '11:45', 'Revisión Odontológica', 'confirmada', 'Traer radiografías'],
    [leadIds[2], dateToday, '15:00', '15:30', 'Presupuesto', 'cancelada', 'Se enfermó'],
    [leadIds[3], dateTomorrow, '09:00', '09:30', 'Consulta Inicial', 'pendiente', ''],
    [leadIds[4], dateTomorrow, '14:00', '15:00', 'Tratamiento', 'confirmada', '']
  ];

  for (const [lead_id, fecha, hora_inicio, hora_fin, motivo, estado, notas] of citasData) {
    db.run(
      'INSERT INTO citas (lead_id, fecha, hora_inicio, hora_fin, motivo, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [lead_id, fecha, hora_inicio, hora_fin, motivo, estado, notas]
    );
  }

  // 3 Mensajes WhatsApp
  db.run('INSERT INTO mensajes_whatsapp (lead_id, telefono, mensaje, direccion) VALUES (?, ?, ?, ?)',
    [leadIds[0], '+525551234567', 'Hola, me gustaría agendar una cita', 'entrante']);
  db.run('INSERT INTO mensajes_whatsapp (lead_id, telefono, mensaje, direccion) VALUES (?, ?, ?, ?)',
    [leadIds[0], '+525551234567', '¡Claro! ¿Qué día te gustaría?', 'saliente']);
  db.run('INSERT INTO mensajes_whatsapp (lead_id, telefono, mensaje, direccion) VALUES (?, ?, ?, ?)',
    [leadIds[2], '+5491112345678', '¿Cuánto cuesta la consulta?', 'entrante']);

  console.log('✅ Datos semilla insertados correctamente.');
}

// Helpers para queries
function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

function runQuery(sql, params = []) {
  db.run(sql, params);
  const changes = db.getRowsModified();
  const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
  saveDatabase();
  return { changes, lastInsertRowid: lastId };
}

export { initDatabase, getAll, getOne, runQuery, saveDatabase };
export default { initDatabase, getAll, getOne, runQuery, saveDatabase };
