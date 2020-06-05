const mongoose = require('mongoose');

const mongiURI = 'mongodb+srv://root:root@cluster0-7icvs.mongodb.net/mobileApp?retryWrites=true&w=majority';

const start = async () => {
  try {
    await mongoose.connect(mongiURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = start;
