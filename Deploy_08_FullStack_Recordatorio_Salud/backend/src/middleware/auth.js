import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  console.log('Headers recibidos:', req.headers);
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token extraído:', token ? `${token.substring(0, 10)}...` : 'no token');

  if (!token) {
    console.error('No se proporcionó token de autenticación');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'super-secret-jwt-token';
    console.log('Verificando token con secreto:', jwtSecret ? 'Secreto configurado' : 'Secreto no configurado');
    
    const user = jwt.verify(token, jwtSecret);
    console.log('Token verificado. Usuario:', user);
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};