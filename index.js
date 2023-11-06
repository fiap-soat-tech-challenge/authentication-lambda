const Connection = require("postgresql-client").Connection;
const jwt = require('jsonwebtoken');

async function cpfIsRegistered(cpf) {
  const connection = new Connection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });
  await connection.connect();
  
  const result = await connection.query(
      'select * from clientes where cpf = $1',
      {params: [cpf]});

  const rows = result.rows;

  await connection.close();
  
  const response = rows.length > 0;
  console.log(response);
  
  return response;
}

async function generateToken(cpf) {
  const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

  const token = jwt.sign({ cpf }, secret, {
    expiresIn: 3600 // expires in 60min
  });
  
  return token;
}

exports.handler = async (event, context) => {
  if (!event.body) {
    return {
      statusCode: 401,
      body: JSON.stringify('Parâmetros inválidos ou incorretos!'),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }
  
  let body = JSON.parse(event.body);
  console.log(body);
  
  if (await cpfIsRegistered(body.cpf)) {
    const token = await generateToken(body.cpf);

    return {
      statusCode: 200,
      body: JSON.stringify({ token: token }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify('Parâmetros inválidos ou incorretos!'),
    headers: {
      'Content-Type': 'application/json',
    }
  };
};
