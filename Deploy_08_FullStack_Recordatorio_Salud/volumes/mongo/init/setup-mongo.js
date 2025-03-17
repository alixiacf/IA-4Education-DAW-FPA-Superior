// Este script se ejecuta al iniciar MongoDB
// Crea las colecciones necesarias y añade datos iniciales

db = db.getSiblingDB('healthreminder');

// Crear un usuario de prueba (password: password123)
db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$GGK4TEoJ.GjZPlAzGCQV1OG7a4EHLiNzrwxAZgrKytEvfTR4S5vJ.",
  created_at: new Date(),
  updated_at: new Date()
});