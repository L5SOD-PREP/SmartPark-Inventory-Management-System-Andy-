const pool = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Spare_Part ORDER BY Name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Spare_Part WHERE SpareP_ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Spare part not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { Name, Category, Quantity, UnityPrice } = req.body;
    if (!Name || !Category || Quantity == null || UnityPrice == null) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO Spare_Part (Name, Category, Quantity, UnityPrice) VALUES (?, ?, ?, ?)',
      [Name, Category, Quantity, UnityPrice]
    );
    res.status(201).json({ message: 'Spare part added.', SpareP_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { Name, Category, Quantity, UnityPrice } = req.body;
    const [result] = await pool.query(
      'UPDATE Spare_Part SET Name=?, Category=?, Quantity=?, UnityPrice=? WHERE SpareP_ID=?',
      [Name, Category, Quantity, UnityPrice, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Spare part not found.' });
    res.json({ message: 'Spare part updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Spare_Part WHERE SpareP_ID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Spare part not found.' });
    res.json({ message: 'Spare part deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
