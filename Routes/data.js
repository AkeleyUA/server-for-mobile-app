const { Router } = require('express');

const router = Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Data = require('../Models/Data');
const User = require('../Models/User');

// for (let i = 1; i < 1000; i++) {
//   const data = new Data({
//     personalNumber: i.toString().padStart(6, '0'),
//     firstName: 'Имён',
//     secondName: 'Фамилин',
//     address: `г. Город, ул. Улица, д.${i}, кв:${Math.round(Math.random() * 10)}`,
//     phone: `+380 00 000 00 ${Math.round(Math.random() * 10)}${Math.round(Math.random() * 10)}`,
//     items: [],
//     parent: [],
//   });

//   data.save();
// }

router.post('/add', [
  check('personalNumber', 'invalid personal key').isLength({ min: 6, max: 6 }),
],
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный персональный ключ',
      });
    }

    const { personalNumber, token } = req.body;
    const id = await jwt.decode(token, 'miraj').userID;
    const data = await Data.findOne({ personalNumber });

    if (!data) {
      return res.status(404).json({ message: 'Такой персональный ключ не найден' });
    }

    const exists = await User.findOne(
      {
        _id: id,
        data: data._id,
      },
    );

    if (exists) {
      return res.status(500).json({ message: 'Данные персонального номера уже добавлены' });
    }

    await User.findOneAndUpdate({ _id: id }, { $addToSet: { data: data._id } });
    await Data.findOneAndUpdate({ personalNumber }, { $addToSet: { parent: id } });

    const user = await User.findOne({ _id: id }).populate('data');
    setTimeout(() => res.json({ message: 'Добавлено!', data: user.data }), 1500);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
  }
});

router.post('/del', async (req, res) => {
  try {
    const { id, token } = req.body;
    const userid = await jwt.decode(token, 'miraj').userID;
    const data = await Data.findOne({ _id: id });
    await User.updateOne(
      {
        _id: userid,
      },
      {
        $pull: { data: data._id },
      },
    );
    const user = await User.findOne({ _id: userid }).populate('data');
    setTimeout(() => res.json({ message: 'Удалено!', data: user.data }), 1500);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
  }
});

router.post('/get', [
  check('token', 'invalid personal key').exists(),
],
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный персональный ключ',
      });
    }
    const { token } = req.body;
    const id = await jwt.decode(token, 'miraj').userID;
    const user = await User.findOne({ _id: id }).populate('data');
    setTimeout(() => res.json({ data: user.data }), 1500);
  } catch (e) {
    res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
  }
});

module.exports = router;
