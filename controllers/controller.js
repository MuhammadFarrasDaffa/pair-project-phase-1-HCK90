const { Product, Category, User, Profile, UserProduct } = require('../models/index')
const { getIDR } = require('../helpers/helper')
const bcrypt = require('bcryptjs')

class Controller {

    static home(req, res) {
        res.redirect('/products')
    }

    static loginForm(req, res) {

        const { error } = req.query

        res.render('login', { error })
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body

            const data = await User.findOne({ where: { email } })

            if (!data) {
                throw new Error("Email not registered!")
            }

            const checkPassword = bcrypt.compareSync(password, data.password)

            if (!checkPassword) {
                throw new Error("Invalid email / password!")
            }

            req.session.user = { id: data.id, username: data.username, email: data.email, role: data.role }

            res.redirect('/products')

        } catch (error) {
            res.redirect(`/login?error=${error.message}`)
        }
    }

    static async registerForm(req, res) {
        try {
            const { errors } = req.query
            res.render('register', { errors })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async register(req, res) {
        try {
            const { username, password, email, confirm_password } = req.body

            if (password !== confirm_password) {
                throw new Error("Password not match with Confirm Password column")
            }

            const newUser = await User.create({ username, password, email })

            await Profile.create({
                userId: newUser.id
            })

            res.redirect('/login')

        } catch (error) {
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
                error = error.errors.map(el => {
                    return el.message
                })

                res.redirect(`/register?errors=${error}`)
            } else if (error.message === "Password not match with Confirm Password column") {
                res.redirect(`/register?errors=${error.message}`)
            } else {
                console.log(error);
                res.send(error)
            }
        }
    }

    static logout(req, res) {
        req.session.destroy(function (error) {
            if (error) {
                console.log(error);
                res.send(error)
            } else {
                res.redirect('/login')
            }
        })
    }

    static async userProfile(req, res) {
        try {
            const { userId } = req.params

            const data = await Profile.findByPk(userId)

            res.render("profile", { data })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async editUserProfile(req, res) {
        try {

            const { userId } = req.params

            const { name, address, profilePicture } = req.body

            await Profile.update({ name, address, profilePicture }, {
                where: {
                    userId
                }
            })

            res.redirect(`/profile/${userId}`)

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async userHistory(req, res) {
        try {

            const { userId } = req.params

            const data = await UserProduct.findAll({
                where :{
                    userId
                }
            })

            res.render("historyUser", { data })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    //! ---------- Products ----------------

    static async getProducts(req, res) {
        try {

            const { error } = req.query

            const session = req.session.user

            const data = await Product.findAll({
                include: [{
                    model: Category,
                    attributes: ['name']
                }],
                order: [['id']]
            })

            const profile = await Profile.findOne({
                where: {
                    userId: session.id
                }
            })

            res.render('products', { data, getIDR, session, profile, error })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async addProductForm(req, res) {
        try {
            const categories = await Category.findAll()
            res.render('addProduct', { categories })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async addProduct(req, res) {
        try {
            const { name, description, price, productPicture, categoryId } = req.body
            // console.log({ name, description, price, productPicture, categoryId });

            await Product.create({ name, description, price, productPicture, categoryId })

            res.redirect('/products')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async editProductForm(req, res) {
        try {

            const { productId } = req.params

            const data = await Product.findByPk(productId)

            const categories = await Category.findAll()

            res.render('editProduct', { data, categories })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async editProduct(req, res) {
        try {

            const { name, description, price, productPicture, categoryId } = req.body

            const { productId } = req.params

            await Product.update({ name, description, price, productPicture, categoryId }, {
                where: {
                    id: productId
                }
            })

            res.redirect('/products')

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async deleteProduct(req, res) {
        try {
            const { productId } = req.params

            await Product.destroy({
                where: {
                    id: productId
                }
            })

            res.redirect('/products')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async template(req, res) {
        try {

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = Controller