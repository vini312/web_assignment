

const fakeCatDB = [ {title:'Eletronics', image:'/img/categories/eletronics.png'},
                    {title:'Cell Phones', image:'/img/categories/cellPhones.png'},
                    {title:'Nutrition', image:'/img/categories/nutrition.png'},
                    {title:'Tools', image:'/img/categories/tools.png'}
                ]
    
    // fakeProdDB:[{name:'Motorola G7', image:'/img/products/motoG7.png', price:'$240.00', category:'Cell Phones', bestSeller:true, quantity:100, description:'Motorola Moto G7 Plus smartphone was launched in February 2019. The phone comes with a 6.20-inch touchscreen display with a resolution of 1080 pixels by 2270 pixels.\nThe Motorola Moto G7 Plus is powered by 1.8GHz octa-core processor and it comes with 4GB of RAM. The phone packs 64GB of internal storage that can be expanded up to 256GB via a microSD card. As far as the cameras are concerned, the Motorola Moto G7 Plus packs a 16-megapixel (f/1.7, 1.22-micron) primary camera and a 5-megapixel (f/2.2) secondary camera on the rear and a 12-megapixel front shooter for selfies.\nThe Motorola Moto G7 Plus runs Android Pie and is powered by a 3000mAh. It measures 157.00 x 75.30 x 8.30 (height x width x thickness) and weighs 176.00 grams.\nThe Motorola Moto G7 Plus is a Dual-SIM (GSM and GSM) smartphone that accepts Nano-SIM and Nano-SIM. Connectivity options include Wi-Fi, GPS, Bluetooth, USB Type-C, FM, 3G and 4G. Sensors on the phone include Face unlock, Fingerprint sensor, Proximity sensor, Accelerometer, Ambient light sensor and Gyroscope.'},
    //             {name:'Galaxy A10', image:'/img/products/galaxyA10.png', price:'$260.00', category:'Cell Phones', bestSeller:true, quantity:100, description:'a'},
    //             {name:'DEWALT DCS391B 20V Circular Saw', image:'/img/products/circularSaw.png', price:'$134.90', category:'Tools', bestSeller:true, quantity:100, description:'a'},
    //             {name:'DEWALT 20V 1/4" Impact Driver Kit', image:'/img/products/impactTool.png', price:'$135.00', category:'Tools',bestSeller:false, quantity:100, description:'a'},
    //             {name:'Samsung 65" RU8000 4K', image:'/img/products/samsung65.png', price:'$1199.90', category:'Eletronics',bestSeller:true, quantity:100, description:'a'},
    //             {name:'Sony Noise Cancelling Headphones WH1000XM3 Bluetooth', image:'/img/products/sonyHeadphone.png', price:'$240.00', category:'Eletronics',bestSeller:true, quantity:100, description:'a'},
    //             {name:'Evlution Nutrition Curcumin with Bioperine 1500mg', image:'/img/products/circumin.png', price:'$19.99', category:'Nutrition',bestSeller:false, quantity:100, description:'a'},
    //             {name:'MuscleTech Creatine Monohydrate Powder', image:'/img/products/suplement.png', price:'$15.99', category:'Nutrition',bestSeller:true, quantity:100, description:'a'}
    //         ],
    
    
//     fakeDBcategories:[],

//     getCategories() {
//         for (let i = 0; i < this.fakeProdDB.length; i++)
//         {
//             let copyFlag = true;

//             for (let j = 0; j < this.fakeDBcategories.length; j++)
//             {
//                if(this.fakeProdDB[i].category == this.fakeDBcategories[j])
//                    copyFlag = false;
//             }
            
//             if(copyFlag)
//                 this.fakeDBcategories.push(this.fakeProdDB[i].category);
//         }
//     }
// }

// for (let index = 0; index < fakeDBs.fakeProdDB.length; index++) {   

// const user = new productModel(fakeDBs.fakeProdDB[index]);
// user.save()
// .then(()=>{ console.log(`product added ${index}`)})
// .catch(err=>console.log(`error DB: ${err}`));
// }
//fakeDBs.createfakeprodDB();
//fakeDBs.getBestSellers();
//fakeDBs.getCategories();

module.exports=fakeCatDB;