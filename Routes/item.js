const { Router } = require('express');

const router = Router();
const { check, validationResult } = require('express-validator');
const Data = require('../Models/Data');
const Item = require('../Models/Item');

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
  check('parent', 'Не выбан пользователь').exists(),
  check('value', 'Не указаны данные').exists(),
  check('dateEnd', 'Не указана дата').exists(),
],
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: '',
      });
    }

    const {
      parent, value, dateStart, dateEnd,
    } = req.body;
    const correctDateStart = dateStart === 0 ? dateEnd : dateStart;
    const item = new Item({
      parent, value, dateStart: correctDateStart, dateEnd,
    });

    await Data.findByIdAndUpdate(parent, { $push: { items: item._id } });
    await item.save();

    const data = await Data.findById(parent).populate('items');
    const items = data.items.reverse();

    res.json({ items, message: 'Добавлено!' });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
  }
});

router.post('/get',
  async (req, res) => {
    try {
      const { id } = req.body;

      const data = await Data
        .findById(id)
        .populate('items');

      const items = data.items.reverse();

      res.json({ items });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: 'Серверная ошибка, повторите попытку' });
    }
  });

module.exports = router;
