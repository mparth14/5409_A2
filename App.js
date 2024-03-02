const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'computeassignment.cb6q4ciuo7aj.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin1234',
  database: 'productsDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release();
});

// Middleware
app.use(bodyParser.json());

// POST endpoint to handle storing products
app.post('/store-products', (req, res) => {
  const { products } = req.body;
  console.log('Received POST request to store products:', products);

  pool.query(
    'INSERT INTO products (name, price, availability) VALUES ?',
    [
      products.map((product) => [
        product.name,
        product.price,
        product.availability,
      ]),
    ],
    (error, results, fields) => {
      if (error) {
        console.error('Error storing products: ', error);
        return res.status(500).json({ error: 'Error storing products.' });
      }
      console.log('Products stored successfully');
      return res.status(200).json({ message: 'Products stored successfully.' });
    },
  );
});

// GET endpoint to retrieve products
app.get('/list-products', (req, res) => {
  console.log('Received GET request to retrieve products');

  pool.query('SELECT * FROM products', (error, results, fields) => {
    if (error) {
      console.error('Error retrieving products: ', error);
      return res.status(500).json({ error: 'Error retrieving products.' });
    }
    console.log('Retrieved products successfully');
    return res.status(200).json({ products: results });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
