const { Router } = require('express');

const router = Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

router.post('/login', [
  check('email', 'Некорректный emal').normalizeEmail().isEmail(),
  check('password', 'Пароль не введён').exists(),
],
async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации',
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Такой пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Некорректный пароль' });
    }

    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ userID: user._id }, 'miraj');

    setTimeout(() => res.json({ token }), 3000);
  } catch (e) {
    res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
  }
});

router.post(
  '/registration',
  [
    check('email', 'Некорректный emal').isEmail(),
    check('password', 'Некоректный пароль, минимум 6 символов').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: 'Пользователь создан' });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
    }
  },
);

module.exports = router;
