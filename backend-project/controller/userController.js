const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../middleware/validate');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { Name, email, password } = req.body;
    if (!Name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const pwError = validatePassword(password);
    if (pwError) return res.status(400).json({ message: pwError });

    const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO Users (Name, email, password) VALUES (?, ?, ?)',
      [Name, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: result.insertId, name: Name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials.' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.ID, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.ID, name: user.Name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setSecurityQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length !== 2) {
      return res.status(400).json({ message: 'Exactly 2 security questions are required.' });
    }
    if (questions[0].question === questions[1].question) {
      return res.status(400).json({ message: 'Security questions must be different.' });
    }

    const salt = await bcrypt.genSalt(10);
    await pool.query('DELETE FROM SecurityQuestions WHERE UserID = ?', [req.user.id]);
    await pool.query(
      'INSERT INTO SecurityQuestions (UserID, Question, Answer) VALUES (?, ?, ?), (?, ?, ?)',
      [
        req.user.id, questions[0].question, await bcrypt.hash(questions[0].answer.toLowerCase().trim(), salt),
        req.user.id, questions[1].question, await bcrypt.hash(questions[1].answer.toLowerCase().trim(), salt),
      ]
    );
    res.json({ message: 'Security questions saved successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSecurityQuestions = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const [users] = await pool.query('SELECT ID FROM Users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'No account found with that email.' });

    const [questions] = await pool.query('SELECT Question FROM SecurityQuestions WHERE UserID = ?', [users[0].ID]);
    if (questions.length === 0) return res.status(400).json({ message: 'No security questions set for this account.' });

    res.json({ question1: questions[0].Question, question2: questions[1].Question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyAndResetPassword = async (req, res) => {
  try {
    const { email, answer1, answer2, password } = req.body;
    if (!email || !answer1 || !answer2 || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const pwError = validatePassword(password);
    if (pwError) return res.status(400).json({ message: pwError });

    const [users] = await pool.query('SELECT ID FROM Users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'No account found with that email.' });

    const [rows] = await pool.query('SELECT * FROM SecurityQuestions WHERE UserID = ? ORDER BY SQ_ID ASC', [users[0].ID]);
    if (rows.length < 2) return res.status(400).json({ message: 'Security questions not set up for this account.' });

    const match1 = await bcrypt.compare(answer1.toLowerCase().trim(), rows[0].Answer);
    const match2 = await bcrypt.compare(answer2.toLowerCase().trim(), rows[1].Answer);
    if (!match1 || !match2) return res.status(403).json({ message: 'Security answers do not match.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query('UPDATE Users SET password = ? WHERE ID = ?', [hashedPassword, users[0].ID]);

    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, setSecurityQuestions, getSecurityQuestions, verifyAndResetPassword };
