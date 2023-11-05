import {Connection} from 'postgresql-client';

async function database() {
  const connection = new Connection('teste');
  await connection.connect();

  const result = await connection.query('select * from clientes');
  const rows = result.rows;

  console.log(rows);

  await connection.close(); 
}

export const handler = async (event, context) => {
  if (event.body) {
    let body = JSON.parse(event.body);
    console.log(body);
    console.log(body.cpf);
  }

  await database();

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
    headers: {
      'Content-Type': 'application/json',
    }
  };
  return response;
};
