const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../models/Admin');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    await Admin.create({
      username: 'admin',
      password: 'TalaAdmin2026'
    });

    console.log('Admin account created successfully!');
    console.log('Username: admin');
    console.log('Password: TalaAdmin2026');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
