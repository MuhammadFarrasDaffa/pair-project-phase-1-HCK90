const easyinvoice = require('easyinvoice');
const fs = require('fs');
const path = require('path');
const { Product, Category, User, Profile, UserProduct } = require('../models/index')

class InvoiceController {
    static async generateInvoice(req, res) {
        try {
            const UserId = req.session.user.id

            const profile = await Profile.findOne({
                where: {
                    UserId
                }
            })

            const history = await UserProduct.findAll({
                where: {
                    UserId
                }
            })

            if (!profile.name || !profile.address ) {
                throw new Error("You need input name and address first in profile to print Invoice")
            }

            const today = new Date();
            const tomorrow = new Date();
            
            tomorrow.setDate(tomorrow.getDate() + 1);

            const data = {
                client: { company: profile.name, address: profile.address },
                sender: { company: "Hacktiv8 Corp", address: "Pondok Indah" },
                images: {
                    logo: "https://www.hacktiv8.com/_next/image?url=%2Flogo.png&w=3840&q=75",
                },
                information: {
                    "number": Math.floor(new Date().getTime() / 1000),
                    "date": today.toISOString().split('T', 1)[0],
                    "due-date": tomorrow.toISOString().split('T', 1)[0]
                },

                products: [],
                bottomNotice: "Thank You.",
                settings: { locale: "id-ID", currency: "IDR" }
            };

            for (let obj of history) {
                data.products.push({ quantity: obj.itemQuantity, description: obj.itemProduct, price: obj.itemPrice })
            }

            const result = await easyinvoice.createInvoice(data);

            // Lokasi folder public
            const publicFolder = path.join(__dirname, '../public');

            // Buat folder jika belum ada
            if (!fs.existsSync(publicFolder)) {
                fs.mkdirSync(publicFolder, { recursive: true });
            }

            // Lokasi file PDF
            const filePath = path.join(publicFolder, 'invoice.pdf');

            // Simpan PDF
            fs.writeFileSync(filePath, result.pdf, 'base64');

            // Kirim ke EJS untuk preview + download
            res.render('invoicePreview', {
                pdfUrl: '/invoice.pdf', UserId
            });
        } catch (error) {
            const UserId = req.session.user.id

            console.log(error);
            res.redirect(`/profile/${UserId}?error=${error.message}`)

        }

    }
}

module.exports = InvoiceController;
