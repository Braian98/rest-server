
// PORT
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// String Connection
const stringConnection = (process.env.NODE_ENV === 'dev') ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

process.env.URLDB = stringConnection;

// vencimiento del token
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '24h';

// SEED token
process.env.SEED = process.env.SEED || 'secret-dev';

// Client ID Google Auth
process.env.CLIENT_ID = process.env.CLIENT_ID || '555735046723-dd8cm470s0o4f5emr6dtmp1f2fj76mqi.apps.googleusercontent.com';