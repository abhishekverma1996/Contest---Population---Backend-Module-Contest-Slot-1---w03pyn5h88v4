const User = require('../models/User');

const getProductsPurchasedByUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID and populate the productsPurchased field
    const user = await User.findById(userId).populate('productsPurchased');

    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not Found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Products Purchased by User',
      data: {
        products: user.productsPurchased,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Couldn't Fetch the Data",
      status: 'Error',
      error: err,
    });
  }
};

const addProductToUser = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'Error', message: 'User not Found' });
    }
    user.productsPurchased.push(productId);
    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'Product Purchased Successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Couldn't Fetch the Data",
      status: 'Error',
      error: error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(User.find());
    res.status(200).json({
      status: 'success',
      data: {
        count,
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      message: 'Users Not Found',
      status: 'Error',
      error: err,
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User Not Found',
      });
    }
    return res.status(200).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'User Fetching Failed',
      status: 'Error',
      error: err,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      return res.status(400).json({
        message: 'Username Missing',
        status: 'Error',
      });
    }
    if (!email) {
      return res.status(400).json({
        message: 'Email Missing',
        status: 'Error',
      });
    }
    if (!password) {
      return res.status(400).json({
        message: 'Password Missing',
        status: 'Error',
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      status: 'success',
      message: 'User Created Successfully',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'User Creation failed',
      status: 'Error',
      error: err,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { updatedData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: updatedData,
    });

    if (!user) {
      return res.status(404).json({
        message: 'User Not Found',
        status: 'Error',
      });
    }

    const updatedUser = await User.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'User Updated Successfully',
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'User Updation Failed',
      status: 'Error',
      error: err,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ status: 'Error', message: 'User not Found' });
    }
    res.status(201).json({
      status: 'success',
      message: 'User Deleted Successfully',
      data: {
        user: deletedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: 'User Deletion Failed',
      status: 'Error',
      error: err,
    });
  }
};

module.exports = {
  addProductToUser,
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  getProductsPurchasedByUser,
};
