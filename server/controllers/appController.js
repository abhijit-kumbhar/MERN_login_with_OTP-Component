const UserModel = require('../model/User.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ENV = require('../config.js')
const otpGenerator = require('otp-generator');

/*miidleware for verify user*/
async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        //check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Cant find User !" })
        next();

    } catch (error) {
        res.status(404).send({ error: " Authentication Error" })
    }
}

async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // Check for existing username
        const userExists = await UserModel.findOne({ username });
        if (userExists) {
            return res.status(400).send({ error: "Please use unique Username" });
        }

        // Check for existing email
        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
            return res.status(400).send({ error: "Please use unique Email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email
        });

        // Save the user
        await user.save();
        res.status(201).send({ msg: "User Registered Successfully" });

    } catch (error) {
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
}

// async function register(req, res) {
//     try {
//         const { username, password, profile, email } = req.body;
//         //check the existing person
//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({ username }, function (err, user) {
//                 if (err) reject(new Error(err))
//                 if (user) reject({ error: "Please use unique Username" });
//                 resolve();
//             })
//         });

//         //check the existing email
//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({ email }, function (err, email) {
//                 if (err) reject(new Error(err))
//                 if (email) reject({ error: "Please use unique Email" });
//                 resolve();
//             })
//         });

//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if (password) {
//                     bcrypt.hash(password, 10)
//                         .then(hashedPassword => {

//                             const user = new UserModel({
//                                 username,
//                                 password: hashedPassword,
//                                 profile: profile || '',
//                                 email
//                             });
//                             // return save result as a responce
//                             user.save()
//                                 .then(result => res.status(201).send({msg : "User Register Successfully"}))
//                                 .catch(error => res.status(500).send({ error }))

//                         }).catch(error => {
//                             return res.status(500).send({
//                                 error: "Enable to hashed password"
//                             })
//                         })
//                 }
//             }).catch(error => {
//                 return res.status(500).send({error})
//             })

//     } catch (error) {
//         return res.status(500).send(error);
//     }
// }

async function login(req, res) {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Dont have a Password" })

                        //create jwt token
                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET, { expiresIn: "24h" })
                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        })
                    })
                    .catch(error => {
                        res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(500).send({ error: "Username not found" })
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}

async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(501).send({ error: "Invalid Username" }); // 400 for bad request
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Couldn't find the User" }); // 404 for not found
        }
        //remove password form user
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(200).send(rest); // 200 for successful response


    } catch (error) {
        return res.status(500).send({ error: error.message || "Cannot find User Data" }); // 500 for server error
    }
}

// async function getUser(req, res) {
//     const { username } = req.params;

//     try {
//         if (!username) 
//             return res.status(501).send({ error: " Invalid Username" });

//         UserModel.findOne({ username }, function (err, user) {
//             if (err) return res.status(500).send({ err });
//             if (!user) return res.status(501).send({ error: "Couldn't find the User" });

//             return res.status(201).send(user)
//         })

//     } catch (error) {
//         return res.status(404).send({ error: "Cannot find User Data" })
//     }

// }

async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const {userId} = req.user
        if (userId) {
            const body = req.body;
            // Using async/await for updateOne
            const result = await UserModel.updateOne({ _id: userId }, body);

            if (result.nModified === 0) {
                return res.status(404).send({ msg: "No record was updated" });
            }

            return res.status(200).send({ msg: "Record Updated...!" });
        } else {
            return res.status(404).send({ error: "User not Found...!" });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

// async function updateUser(req, res) {
//     try {
//         const id = req.query.id;
//         if(id){
//             const body = req.body;
//             //update the data
//             UserModel.updateOne({_id: id}, body, function(err, data){
//                 if(err) throw err;
//                 return res.status(201).send({msg :"Record Updated...!"})
//             })

//         }else{
//             return res.status(401).send({error: "User not Found...!"})
//         }
        
//     } catch (error) {
//         return res.status(401).send({error})
//     }
// }

async function generateOTP(req, res) {
   req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets : false, upperCaseAlphabets : false, specialChars : false})
    res.status(201).send({code : req.app.locals.OTP})
}

async function verifyOTP(req, res) {
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; //reset the otp value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({msg : "Verify Successfully !"})
    }
    return res.status(400).send({error : " Invalid OTP"})
}

async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        return res.status(201).send({flag : req.app.locals.resetSession})   
    }
    return res.status(440).send({error : "Session expired !"})
}

// async function resetPassword(req, res) {
//     try {
//         const {username, password} = req.body;
//         try {
//             UserModel.findOne({username})
//             .then(user=>{
//                 bcrypt.hash(password, 10)
//                 .then(hashedPassword =>{
//                     UserModel.updateOne({username: user.username},
//                         {password : hashedPassword}, function(err, data){
//                             if(err) throw err;
//                             return res.status(201).send({msg: "Record Updated...!"})
//                         }
//                     )
//                 })
//                 .catch(error =>{
//                     return res.status(500).send({error: "Enable to hashed password"})
//                 })
//             })
//             .catch(error => {
//                 return res.status(404).send({error: "Username not Found !"})
//             })
            
//         } catch (error) {
//             return res.status(500).send({error})
//         }
//     } catch (error) {
//         return res.status(401).send({error})
//     }
// }

async function resetPassword(req, res) {
    try {
        if(!req.app.locals.resetSession)     return res.status(440).send({error : "Session expired !"})
        const { username, password } = req.body;
        
        // Find the user by username
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not found!" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update the user's password
        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });
        req.app.locals.resetSession = false; // allow access to this route only once
        return res.status(201).send({ msg: "Record updated!" });
        
    } catch (error) {
        if (error.message === "Username not found!") {
            return res.status(404).send({ error: error.message });
        } else if (error.message === "Unable to hash password") {
            return res.status(500).send({ error: error.message });
        } else {
            return res.status(500).send({ error: "An error occurred" });
        }
    }
}

module.exports = { verifyUser, register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword }