const User = require('../Models/login');

const confirmUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      user.confirmed = true;
      await user.save();

      res.redirect('/confirmation.html');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Confirmation failed. Please try again later.' });
    }
}

module.exports = confirmUser;