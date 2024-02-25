import jwt from "jsonwebtoken";

export function generateAuthToken(data) {
  const stringData = JSON.stringify(data);
  const token = jwt.sign(stringData, process.env.SECRET_KEY);
  return token;
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedData) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedData);
      }
    });
  });
}
