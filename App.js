const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'assignment2.cb6q4ciuo7aj.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'sys',
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

// Middleware
app.use(bodyParser.json());

// Dummy products data (to be replaced with database interaction)
let products = [];

// POST endpoint to handle storing products
// POST endpoint to handle storing products
app.post('/store-products', (req, res) => {
  const { products } = req.body;

  // Assuming database interaction to store products
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
      return res.status(200).json({ message: 'Products stored successfully.' });
    },
  );
});

// GET endpoint to retrieve products
app.get('/list-products', (req, res) => {
  // Assuming database interaction to retrieve products
  pool.query('SELECT * FROM products', (error, results, fields) => {
    if (error) {
      console.error('Error retrieving products: ', error);
      return res.status(500).json({ error: 'Error retrieving products.' });
    }
    return res.status(200).json({ products: results });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
