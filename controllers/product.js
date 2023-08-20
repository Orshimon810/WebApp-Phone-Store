const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');
const category = require('../models/category');
const multer = require('multer');

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

//for uploads picutres
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/img')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })

async function getAllProducts (req,res) {
    const productList = await Product.find();
    //.select('name image -_id') if we want to show specific fields

    if(!productList){
        return res.status(500).json({success:false});
    }
    res.send(productList);
}

async function createdProduct(req, res) {
    const category = await Category.findById(req.body.category);
    if(!category)
        return res.status(400).send('Invalid category!');

        const file = req.file;
        if(!file) return res.status(400).send('No image in the request')

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/img/`;
    
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`, //http://localhost:3000/public/uploads/image-23232323
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        const createdProduct = await product.save();

        if(!createdProduct)
            return res.status(500).send('The product cannot be created');

            res.send(createdProduct);
      
}


async function getProduct(req,res){
    const product = await Product.findById(req.params.id);
    //.populate('category')

    if(!product){
        res.status(500).json({ success: false, message: 'Product with this ID has not found' });
    }
    res.status(200).send(product);
}

async function getProductStockNumber(req,res){
    const product = await Product.findById(req.params.id);
    //.populate('category')

    if(!product){
        res.status(500).json({ success: false, message: 'Product with this ID has not found' });
    }
    res.status(200).send({Stock:product.countInStock});
}

async function updateProduct (req,res){
    if(!mongoose.isValidObjectId(req.params.id))
         res.status(400).send('Invalid Product ID!');

    const category = await Category.findById(req.body.category);
    if(!category)
        return res.status(400).send('Invalid category!');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new:true}
    )

    if(!product){
        return res.status(500).send('the product cannot be Updated');
    }
    
    res.send(product);
}


function deleteProduct(req, res) {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (product) {
                return res.status(200).json({ success: true, message: 'product has been deleted' });
            } else {
                return res.status(404).json({ success: false, message: 'product not found' });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: false, error: err});
        });
}

async function getCount (req,res){
    const productCount = await Product.countDocuments({});

    if(!productCount)
        res.status(500).json({success:false,message:'Problem with product count'});

    res.send({productCount:productCount});
}

async function getFeaturedProducts(req,res){
    const featuredProducts = await Product.find({isFeatured:true});

    if(!featuredProducts)
        res.status(500).json({success:false});

    res.send(featuredProducts);
}

async function getByCategory(req, res) {
    try {
        let filter = {};
        if (req.query.categories) {
            const categoryIds = req.query.categories.split(',');
            console.log('Category IDs:', categoryIds);
            filter = { category: { $in: categoryIds } };
        }
        console.log('Filter:', filter);
        const productList = await Product.find(filter);

        if (!productList || productList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for the specified category' });
        }

        res.json(productList);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

async function updateGallery (req, res) { 
    console.log('start')
    if (!mongoose.isValidObjectId(req.params.id)) {
        console.log('Invalid Product ID:', req.params.id);
        return res.status(400).send('Invalid Product ID!');
    }

    console.log("Request Files:", req.files); // Log uploaded files

    const files = req.files;
    let imagesPaths =[];
    const basePath = `${req.protocol}://${req.get('host')}/public/img/`;

    if (files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    console.log('Images Paths:', imagesPaths); // Log image paths

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths,
        },
        { new: true }
    )

    if (!product) {
        console.log('Gallery Update Failed');
        return res.status(500).send('The Gallery cannot be Updated');
    }

    console.log('Gallery Updated Successfully');
    res.send(product);
}


module.exports= {
    getAllProducts,
    createdProduct,
    getProduct,
    getProductStockNumber,
    updateProduct,
    deleteProduct,
    getCount,
    getFeaturedProducts,
    getByCategory,
    uploadOptions,
    updateGallery,
}