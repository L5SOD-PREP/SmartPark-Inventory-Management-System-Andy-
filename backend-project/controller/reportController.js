const pool = require('../db/connection');

const stockStatus = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT sp.*,
        COALESCE(si.TotalStockIn, 0) AS TotalStockIn,
        COALESCE(so.TotalStockOut, 0) AS TotalStockOut
      FROM Spare_Part sp
      LEFT JOIN (SELECT SpareP_ID, SUM(StockInQuantity) AS TotalStockIn FROM Stock_In GROUP BY SpareP_ID) si ON sp.SpareP_ID = si.SpareP_ID
      LEFT JOIN (SELECT SpareP_ID, SUM(StockOutQuantity) AS TotalStockOut FROM Stock_Out GROUP BY SpareP_ID) so ON sp.SpareP_ID = so.SpareP_ID
      ORDER BY sp.Name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const stockReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = `
      SELECT 'Stock In' AS Type, si.StockIn_ID AS ID, sp.Name, si.StockInQuantity AS Quantity, NULL AS UnitPrice, NULL AS TotalPrice, si.StockInDate AS Date
      FROM Stock_In si
      JOIN Spare_Part sp ON si.SpareP_ID = sp.SpareP_ID
    `;
    const params = [];
    if (startDate && endDate) {
      query += ' WHERE si.StockInDate BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    query += `
      UNION ALL
      SELECT 'Stock Out' AS Type, so.StockOut_ID AS ID, sp.Name, so.StockOutQuantity AS Quantity, so.StockOutUnitPrice AS UnitPrice, so.StockOutTotalPrice AS TotalPrice, so.StockOutDate AS Date
      FROM Stock_Out so
      JOIN Spare_Part sp ON so.SpareP_ID = sp.SpareP_ID
    `;
    if (startDate && endDate) {
      query += ' WHERE so.StockOutDate BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    query += ' ORDER BY Date DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const lowStockAlert = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM Spare_Part WHERE Quantity < 10 ORDER BY Quantity ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { stockStatus, stockReport, lowStockAlert };
