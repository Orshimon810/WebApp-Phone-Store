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

    if (!productList || productList.length === 0) {
        return res.status(404).json({ success: false, message: 'No products found' });
    }
    res.send(productList);
}

async function createdProduct(req, res) {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).send('Invalid category!');
        }

        const file = req.file;
        if (!file) {
            return res.status(400).send('No image in the request');
        }

        const fileName = file.filename;
        const basePath = `${req.protocol}://localhost:5500/public/img/`;
    
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        const createdProduct = await product.save();

        if (!createdProduct) {
            return res.status(500).send('The product cannot be created');
        }

        res.send(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('An error occurred while creating the product');
    }
}


function validateProductId(req, res, next) {
    const productId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
  
    next();
  }

async function getProduct(req,res){
    const product = await Product.findById(req.params.id);
    //.populate('category')

    if(!product){
        res.status(404).json({ success: false, message: 'Product with this ID was not found' });
    }
    res.status(200).send(product);
}

async function getProductImage(req,res){
    try {

    const product = await Product.findById(req.params.id);
    //.populate('category')

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({url:product.image});
    }catch (error) {
    console.error("Error fetching product from the database:", error);
    res.status(500).json({ message: 'Internal server error' });
}
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


async function getByBrand(req, res) {
    try {
        let filter = {};
        if (req.query.brand) {
            const brandName = req.query.brand;
            console.log('Brand Name:', brandName);
            filter = { brand: brandName };
        }
        console.log('Filter:', filter);
        
        const productList = await Product.find(filter);

        if (!productList || productList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for the specified brand' });
        }

        res.json(productList);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}


async function getByCategory(req, res) {
    try {
        if (!req.query.categories) {
            return res.status(400).json({ success: false, message: 'No category names provided' });
        }

        const categoryNames = req.query.categories.split(',');
        console.log('Category Names:', categoryNames);

        // Query the Category collection to find the category IDs
        const categories = await Category.find({ name: { $in: categoryNames } });
        const categoryIds = categories.map(category => category._id);

        console.log('Category IDs:', categoryIds);

        // Use the category IDs to query the Product collection
        const productList = await Product.find({ category: { $in: categoryIds } });

        if (!productList || productList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for the specified category' });
        }

        res.json(productList);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

async function updateCountProduct(req, res) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID!');
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { countInStock: -1 } }, // Decrement the countInStock by 1
            { new: true }
        );

        if (!product) {
            return res.status(500).send('The product countInStock cannot be updated');
        }

        res.send(product);
    } catch (error) {
        console.error('Error updating product countInStock:', error);
        res.status(500).send('Internal server error');
    }
}

async function getProductByName(req, res) {
    try {
        const productName = req.params.name;
        console.log(productName)
    
        const product = await Product.findOne({ name: productName }); // Assuming 'description' holds the product name
      
        console.log(product)
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

async function autocompleteSuggestions(req, res) {
    try {
        const query = req.params.query; // User's input
        
        // Find products with names that start with the query
        const suggestions = await Product.find({ name: { $regex: `^${query}`, $options: 'i' } })
            .select('name')
            .limit(5); // Limit the number of suggestions returned
        
        const suggestionNames = suggestions.map(product => product.name);
        res.json(suggestionNames);
    } catch (error) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

async function getProductsInRange(minPrice, maxPrice) {
    try {
        const productList = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        if (!productList || productList.length === 0) {
            return [];
        }

        return productList;
    } catch (error) {
        console.error('Error fetching products by price range:', error);
        throw new Error('An error occurred while fetching products');
    }
}

async function getProductsByPriceRange(req, res) {
    try {
        const minPrice = parseFloat(req.query.min);
        const maxPrice = parseFloat(req.query.max);

        // Check if the provided min and max prices are valid numbers
        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).json({ error: 'Invalid price range' });
        }

        // Call the function to fetch products within the price range
        const productsInRange = await getProductsInRange(minPrice, maxPrice);

        // Send the products as response
        res.json(productsInRange);
    } catch (error) {
        console.error('Error fetching products by price range:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
}



module.exports= {
    getProductsByPriceRange,
    autocompleteSuggestions,
    getProductByName,
    getByBrand,
    validateProductId,
    getAllProducts,
    getProductImage,
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
    updateCountProduct,
}