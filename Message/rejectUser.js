const User = require('../Models/login');

const rejectUser = async (req, res) => {
     try {
       const user = await User.findById(req.params.userId);
       if (!user) {
         return res.status(404).json({ message: "User not found." });
       }

       // Delete the user from the database
       await User.findByIdAndDelete(req.params.userId);

       res.redirect("/rejectSignUp.html");
     } catch (error) {
       console.error(error);
       res
         .status(500)
         .json({ message: "Rejection failed. Please try again later." });
     }
}

module.exports = rejectUser;