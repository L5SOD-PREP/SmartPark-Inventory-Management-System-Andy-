const pool = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT si.*, sp.Name AS SparePartName, sp.Category
       FROM Stock_In si
       JOIN Spare_Part sp ON si.SpareP_ID = sp.SpareP_ID
       ORDER BY si.StockInDate DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { SpareP_ID, StockInQuantity, StockInDate } = req.body;
    if (!SpareP_ID || !StockInQuantity || !StockInDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const [sp] = await pool.query('SELECT * FROM Spare_Part WHERE SpareP_ID = ?', [SpareP_ID]);
    if (sp.length === 0) return res.status(404).json({ message: 'Spare part not found.' });

    await pool.query(
      'INSERT INTO Stock_In (SpareP_ID, StockInQuantity, StockInDate) VALUES (?, ?, ?)',
      [SpareP_ID, StockInQuantity, StockInDate]
    );
    await pool.query(
      'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SpareP_ID = ?',
      [StockInQuantity, SpareP_ID]
    );
    res.status(201).json({ message: 'Stock In recorded.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create };
