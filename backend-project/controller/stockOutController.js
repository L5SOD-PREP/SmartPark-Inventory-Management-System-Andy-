const pool = require('../db/connection');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT so.*, sp.Name AS SparePartName, sp.Category
       FROM Stock_Out so
       JOIN Spare_Part sp ON so.SpareP_ID = sp.SpareP_ID
       ORDER BY so.StockOutDate DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT so.*, sp.Name AS SparePartName, sp.Category
       FROM Stock_Out so
       JOIN Spare_Part sp ON so.SpareP_ID = sp.SpareP_ID
       WHERE so.StockOut_ID = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Stock out record not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { SpareP_ID, StockOutQuantity, StockOutUnitPrice, StockOutDate } = req.body;
    if (!SpareP_ID || !StockOutQuantity || !StockOutUnitPrice || !StockOutDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const [sp] = await pool.query('SELECT * FROM Spare_Part WHERE SpareP_ID = ?', [SpareP_ID]);
    if (sp.length === 0) return res.status(404).json({ message: 'Spare part not found.' });
    if (sp[0].Quantity < StockOutQuantity) {
      return res.status(400).json({ message: 'Insufficient stock.' });
    }

    await pool.query(
      'INSERT INTO Stock_Out (SpareP_ID, StockOutQuantity, StockOutUnitPrice, StockOutDate) VALUES (?, ?, ?, ?)',
      [SpareP_ID, StockOutQuantity, StockOutUnitPrice, StockOutDate]
    );
    await pool.query(
      'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SpareP_ID = ?',
      [StockOutQuantity, SpareP_ID]
    );
    res.status(201).json({ message: 'Stock Out recorded.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { StockOutQuantity, StockOutUnitPrice, StockOutDate } = req.body;
    const [existing] = await pool.query('SELECT * FROM Stock_Out WHERE StockOut_ID = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Stock out record not found.' });

    const oldRecord = existing[0];
    const qtyDiff = StockOutQuantity - oldRecord.StockOutQuantity;

    await pool.query(
      'UPDATE Stock_Out SET StockOutQuantity=?, StockOutUnitPrice=?, StockOutDate=? WHERE StockOut_ID=?',
      [StockOutQuantity, StockOutUnitPrice, StockOutDate, req.params.id]
    );
    await pool.query(
      'UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SpareP_ID = ?',
      [qtyDiff, oldRecord.SpareP_ID]
    );
    res.json({ message: 'Stock Out updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM Stock_Out WHERE StockOut_ID = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Stock out record not found.' });

    await pool.query(
      'UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SpareP_ID = ?',
      [existing[0].StockOutQuantity, existing[0].SpareP_ID]
    );
    await pool.query('DELETE FROM Stock_Out WHERE StockOut_ID = ?', [req.params.id]);
    res.json({ message: 'Stock Out deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
