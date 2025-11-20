const { Product, UserProduct } = require('../models/index')

class CartController {

    static async addToCart(req, res) {
        try {
            const { productId } = req.body;
            const product = await Product.findOne({
                where: {
                    id: productId
                }
            });

            // console.log(product, "INI PRODUCT");

            if (!req.session.cart) req.session.cart = [];

            // cek apakah produk sudah ada di cart
            let item = req.session.cart.find(i => i.productId == productId);

            if (item) {
                item.qty += 1;
            } else {
                req.session.cart.push({
                    imageURL: product.productPicture,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1
                });
            }

            res.redirect("/products");
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static viewCart(req, res) {

        const { error } = req.query
        const user = req.session.user
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        res.render("cart", { user, cart, total, error });
    }

    static async updateQty(req, res) {
        try {
            const { productId, qty } = req.body;
            const cart = req.session.cart;

            const item = cart.find(i => i.productId == productId);

            const product = await Product.findProduct(productId) // static method

            if (item) {
                if (qty > product.stock) {
                    throw new Error(`Orders exceed the number of available stocks, stock ${product.name} available is ${product.stock}`)
                } else {
                    item.qty = parseInt(qty);
                }
            }

            res.redirect("/cart");
        } catch (error) {
            console.log(error);
            res.redirect(`/cart?error=${error.message}`)
        }
    }

    static removeItem(req, res) {
        const { productId } = req.params;

        req.session.cart = req.session.cart.filter(
            item => item.productId != productId
        );

        res.redirect("/cart");
    }

    static async checkout(req, res) {
        try {

            console.log(req.body);

            const { userId, productId, itemProduct, itemQuantity, itemPrice, totalPrice } = req.body

            if (typeof userId === "string") {

                const product = await Product.findProduct(productId)

                if (itemQuantity > product.stock) {
                    throw new Error(`Orders exceed the number of available stocks, stock ${product.name} available is ${product.stock}`)
                }

                await UserProduct.create({
                    userId,
                    productId,
                    itemProduct,
                    itemQuantity,
                    itemPrice,
                    totalPrice
                })

                product.decrement('stock', { by: itemQuantity })

            } else {
                for (let i = 0; i < userId.length; i++) {

                    const product = await Product.findProduct(productId[i])

                    if (itemQuantity[i] > product.stock) {
                        throw new Error(`Orders exceed the number of available stocks, stock ${product.name} available is ${product.stock}`)
                    }
                }

                for (let j = 0; j < userId.length; j++) {

                    const product = await Product.findProduct(productId[j])

                    await UserProduct.create({
                        userId: userId[j],
                        productId: productId[j],
                        itemProduct: itemProduct[j],
                        itemQuantity: itemQuantity[j],
                        itemPrice: itemPrice[j],
                        totalPrice: totalPrice[j]
                    })

                    product.decrement('stock', { by: itemQuantity[j] })

                }
            }

            req.session.cart = []

            res.redirect('/products')

        } catch (error) {
            console.log(error);
            res.redirect(`/cart?error=${error.message}`)
        }
    }
}

module.exports = CartController;
