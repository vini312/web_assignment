const fakeDBs=
{
    fakeCatDB:[ {title:'Eletronics', image:'/img/categories/eletronics.png'},
                {title:'Cell Phones', image:'/img/categories/cellPhones.png'},
                {title:'Nutrition', image:'/img/categories/nutrition.png'},
                {title:'Tools', image:'/img/categories/tools.png'}
            ],

    fakeProdDB:[{name:'Motorola G7', image:'/img/products/motoG7.png', price:'$240.00', category:'Cell Phones',bestSeller:true},
                {name:'Galaxy A10', image:'/img/products/galaxyA10.png', price:'$260.00', category:'Cell Phones',bestSeller:true},
                {name:'DEWALT DCS391B 20V Circular Saw', image:'/img/products/circularSaw.png', price:'$134.90', category:'Tools', bestSeller:true},
                {name:'DEWALT 20V 1/4" Impact Driver Kit', image:'/img/products/impactTool.png', price:'$135.00', category:'Tools',bestSeller:false},
                {name:'Samsung 65" RU8000 4K', image:'/img/products/samsung65.png', price:'$1199.90', category:'Eletronics',bestSeller:true},
                {name:'Sony Noise Cancelling Headphones WH1000XM3 Bluetooth', image:'/img/products/sonyHeadphone.png', price:'$240.00', category:'Eletronics',bestSeller:true},
                {name:'Evlution Nutrition Curcumin with Bioperine 1500mg', image:'/img/products/circumin.png', price:'$19.99', category:'Nutrition',bestSeller:false},
                {name:'MuscleTech Creatine Monohydrate Powder', image:'/img/products/suplement.png', price:'$15.99', category:'Nutrition',bestSeller:true}
            ],
    
    fakeBestDB:[],

    getBestSellers()
    {
        for (let index = 0; index < this.fakeProdDB.length; index++) {
            if(this.fakeProdDB[index].bestSeller) {
                this.fakeBestDB.push(this.fakeProdDB[index]);
            }
        }
    }
}

fakeDBs.getBestSellers();

module.exports=fakeDBs;