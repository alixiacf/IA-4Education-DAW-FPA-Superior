const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        // Validación de entrada
        if (!name || !email) {
            return res.status(400).json({ error: "Nombre y correo electrónico son obligatorios" });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Crear usuario
        const user = new User({ name, email, avatar });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("❌ Error al crear usuario:", error.message);
        res.status(500).json({ error: `Error interno: ${error.message}` });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
