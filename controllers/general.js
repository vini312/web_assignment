const express = require('express');
const router = express.Router();
//import the model to be able to use database
const productModel = require("../model/product");
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

//import the fake database for categories
const DBs = require("../model/DBs");

//get a request from http to the server to the root page
router.get("/",(req,res)=>{

    productModel.find({bestSeller:true})
    .then(bestSellers=>{
        //filter the information necessary
        const bestSellerDB = bestSellers.map(bestSeller=>{
            return {
                _id:bestSeller._id,
                name: bestSeller.name,
                image: bestSeller.image,
                price: bestSeller.price,
                category: bestSeller.category,
                bestSeller: bestSeller.bestSeller,
                quantity: bestSeller.quantity,
                description: bestSeller.description
            }
        });
        // as a response obj argument, render the file home.handlebars
        res.render("general/home",{
            title: "Home Page",
            catDB: DBs,
            bestDB: bestSellerDB
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))
});

router.get("/userProdList",(req,res)=>{
    if(req.session.products == null || req.session.products == ''){
        res.render("general/userProdList",{
            title: "Your products",
            empty: 1
        });
    }
    else{
        productModel.find({_id: req.session.products})
        .then(products=>{
            //filter the information necessary
            let prodList = products.map(product=>{
                return {
                    _id:product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    category: product.category,
                    bestSeller: product.bestSeller,
                    quantity: product.quantity,
                    description: product.description
                }
            });

            //overwrite the value quantity to the quantity on cart, sice the original value i not necessary on this page
            prodList.forEach((prod, i)=>{
                req.session.products.forEach((sessProd,j)=>{
                    if (prod._id == sessProd._id) {
                        prod.quantity = sessProd.qty;
                    }
                });
            });

            let totalPrice = 0;
            prodList.forEach((prod)=>{
                totalPrice += prod.price * prod.quantity;
            });
            let finalPrice = totalPrice.toFixed(2);

            // as a response obj argument, render the file products.handlebars
            res.render("general/userProdList",{
                title: "Your products",
                prodList,
                totalPrice: finalPrice
            });
        })
        .catch(err=>console.log(`Error when finding from database ${err}`))
    }
});

router.post("/order",(req,res)=>{

    productModel.find({_id: req.session.products})
        .then(products=>{
            //filter the information necessary
            let prodList = products.map(product=>{
                return {
                    _id:product._id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity
                }
            });

            //overwrite the value quantity to the quantity on cart
            prodList.forEach((prod, i)=>{
                req.session.products.forEach((sessProd,j)=>{
                    if (prod._id == sessProd._id) {
                        prod.quantity = sessProd.qty;
                    }
                });
            });

            let emailProdList = "";
            let totalPrice = 0;
            prodList.forEach((prod)=>{
                totalPrice += prod.price * prod.quantity;
                emailProdList += `${prod.name}, Unit price: $${prod.price.toFixed(2)}, itens: ${prod.quantity} <br>`;
            });
            let finalPrice = totalPrice.toFixed(2);
            
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            
            const msg = {
                to: `${req.session.userInfo.email}`,
                from: 'amazonOrder@confirmation.com',
                subject: 'Your order confirmation',
                html:   `Hello ${req.session.userInfo.name}, <br><br>

                        Thank you for shopping on our web site! <br><br>

                        The total for your order is: $${finalPrice}<br><br>
                        
                        Here is a list of the products in your order: <br><br>

                        ${emailProdList}<br><br>

                        Best regards <br><br>
                        
                        Amazon.`
            };

            sgMail.send(msg)
            .then(()=>{
                req.session.products = [];
                res.redirect("/userProdList");
            })
            .catch(err=>{
                console.log(`Error sending confirmation email: ${err}`);
            }) 
        })
        .catch(err=>console.log(`Error when finding from database ${err}`))
});

module.exports = router;