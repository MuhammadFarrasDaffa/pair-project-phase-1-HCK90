const { Product, UserProduct } = require('../models/index')

class CartController {

    static async addToCart(req, res) {
        try {
            const { productId } = req.body;
            const product = await Product.findOne({
                where: {
                    id : productId
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
        const user = req.session.user
        const cart = req.session.cart || [];
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        
        res.render("cart", { user,cart, total });
    }

    static updateQty(req, res) {
        const { productId, qty } = req.body;
        const cart = req.session.cart;

        const item = cart.find(i => i.productId == productId);

        if (item) {
            item.qty = parseInt(qty);
        }

        res.redirect("/cart");
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

            for(let i = 0; i < userId.length; i++){
                await UserProduct.create({
                    userId : userId[i],
                    productId : productId[i],
                    itemProduct : itemProduct[i],
                    itemQuantity : itemQuantity[i],
                    itemPrice : itemPrice[i],
                    totalPrice : totalPrice[i]
                })
            }

            res.redirect('/products')
            
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = CartController;
