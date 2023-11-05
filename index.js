export const handler = async (event, context) => {
  if (event.body) {
    let body = JSON.parse(event.body);
    console.log(body);
    console.log(body.cpf);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
    headers: {
      'Content-Type': 'application/json',
    }
  };
  return response;
};
