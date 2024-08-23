const Router = require('express');
const router =Router();

/*import all controller*/
const controller = require('../controllers/appController.js')
const {Auth, localVariables} = require('../middleware/auth.js');
const registerMail = require('../controllers/mailer.js')

/*POST Method */
router.route('/register').post(controller.register)
router.route('/registerMail').post(registerMail); //send mail
router.route('/authenticate').post(controller.verifyUser, (req,res)=>{res.end()});
router.route('/login').post(controller.verifyUser, controller.login);

/*GET Method */
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);

/*PUT Method */
router.route('/updateuser').put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);

module.exports = router;