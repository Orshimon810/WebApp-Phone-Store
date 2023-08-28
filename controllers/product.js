const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');
const category = require('../models/category');
const multer = require('multer');

// Define a map of valid file MIME types to file extensions
const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

// Configure storage for multer
const storage = multer.diskStorage({
     // Define the destination folder for uploaded files
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

         // Check if the uploaded file's MIME type is valid
        if(isValid) {
            uploadError = null
        }
         // Set the destination folder for storing uploaded files
      cb(uploadError, 'public/img')
    },
    // Define the filename format for uploaded files
    filename: function (req, file, cb) {
    // Modify the original filename to replace spaces with hyphens
      const fileName = file.originalname.split(' ').join('-');
    // Get the file extension based on the file's MIME type
      const extension = FILE_TYPE_MAP[file.mimetype];
    // Construct the final filename with a timestamp and extension
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
        // Find the category by its ID
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).send('Invalid category!');
        }

         // Check if an image is included in the request
        const file = req.file;
        if (!file) {
            return res.status(400).send('No image in the request');
        }

         // Construct the complete image URL
        const fileName = file.filename;
        const basePath = `${req.protocol}://localhost:5500/public/img/`;
    
         // Create a new product using the received data
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

         // Save the new product to the database
        const createdProduct = await product.save();

         // Check if the product was successfully saved
        if (!createdProduct) {
            return res.status(500).send('The product cannot be created');
        }

        res.send(createdProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('An error occurred while creating the product');
    }
}

// Middleware function to validate product ID
function validateProductId(req, res, next) {
    // Extract the product ID from the request parameters
    const productId = req.params.id;
  
     // Check if the extracted product ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        // If the ID is not valid, return a 400 Bad Request response
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
  
    // If the ID is valid, call the next middleware or route handler
    next();
  }

async function getProduct(req,res){
    // Use the Product model to find the product by its ID
    const product = await Product.findById(req.params.id);
    //.populate('category')

    // Check if the product was found
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

// Function to update a product
async function updateProduct (req,res){
     // Check if the provided product ID is valid
    if(!mongoose.isValidObjectId(req.params.id))
         res.status(400).send('Invalid Product ID!');

    // Find the category by its ID
    const category = await Category.findById(req.body.category);
    if(!category)
        return res.status(400).send('Invalid category!');

    // Update the product with the provided data
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

// Function to delete a product by its ID
function deleteProduct(req, res) {
    // Find the product by its ID and delete it
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (product) {
                // If the product was found and deleted, send a success response
                return res.status(200).json({ success: true, message: 'product has been deleted' });
            } else {
                // If the product was not found, send a failure response
                return res.status(404).json({ success: false, message: 'product not found' });
            }
        })
        .catch(err => {
            // If an error occurs during the process, send an error response
            return res.status(500).json({ success: false, error: err});
        });
}

async function getCount (req,res){
    // Use the countDocuments method to get the total count of products
    const productCount = await Product.countDocuments({});

    // Check if the product count is valid and send the response accordingly
    if(!productCount)
        res.status(500).json({success:false,message:'Problem with product count'});

    res.send({productCount:productCount});
}

// Function to fetch featured products
async function getFeaturedProducts(req,res){
    // Find products that are marked as featured (isFeatured: true)
    const featuredProducts = await Product.find({isFeatured:true});

      // Check if any featured products were found and send the response accordingly
    if(!featuredProducts)
        res.status(500).json({success:false});

    res.send(featuredProducts);
}

// Function to update product gallery
async function updateGallery (req, res) { 
    console.log('start')

    // Check if the provided product ID is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
        console.log('Invalid Product ID:', req.params.id);
        return res.status(400).send('Invalid Product ID!');
    }

    console.log("Request Files:", req.files); // Log uploaded files

    const files = req.files;
    let imagesPaths =[];
    const basePath = `${req.protocol}://${req.get('host')}/public/img/`;

    // If there are uploaded files, create an array of image paths
    if (files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    console.log('Images Paths:', imagesPaths); // Log image paths

     // Update the product's images field with the new image paths
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths,
        },
        { new: true }
    )

    // Check if the product was updated successfully and send an appropriate response
    if (!product) {
        console.log('Gallery Update Failed');
        return res.status(500).send('The Gallery cannot be Updated');
    }

    console.log('Gallery Updated Successfully');
    res.send(product);
}

// Function to fetch products by brand
async function getByBrand(req, res) {
    try {
        let filter = {};

         // Check if brand name is provided in the query parameters
        if (req.query.brand) {
            const brandName = req.query.brand;
            console.log('Brand Name:', brandName);

            // Create a filter to search products by the specified brand
            filter = { brand: brandName };
        }
        console.log('Filter:', filter);
        
        // Use the filter to query the Product collection
        const productList = await Product.find(filter);

        // If no products are found, send an appropriate response
        if (!productList || productList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for the specified brand' });
        }

         // Send the list of products as a response
        res.json(productList);
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

// Function to fetch products by category
async function getByCategory(req, res) {
    try {
         // Check if category names are provided in the query parameters
        if (!req.query.categories) {
            return res.status(400).json({ success: false, message: 'No category names provided' });
        }

        // Split the comma-separated category names into an array
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

// Function to update the countInStock of a product
async function updateCountProduct(req, res) {
     // Check if the provided product ID is a valid ObjectId
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID!');
    }

    // Find the product by ID and increment the countInStock by -1 (decrement by 1)
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { countInStock: -1 } }, // Decrement the countInStock by 1
            { new: true } // Return the updated product
        );

           // If the product is not found, send an appropriate response
        if (!product) {
            return res.status(500).send('The product countInStock cannot be updated');
        }

          // Send the updated product as a response
        res.send(product);
    } catch (error) {
        console.error('Error updating product countInStock:', error);
        res.status(500).send('Internal server error');
    }
}

// Function to fetch a product by its name
async function getProductByName(req, res) {
    try {
        const productName = req.params.name; // Get the product name from the request parameters
        console.log(productName)
    
        // Find the product with the provided name in the 'name' field
        const product = await Product.findOne({ name: productName }); 
      
        console.log(product) // Output the retrieved product to the console
        
          // If no product is found, send a response indicating that the product was not found
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Send the retrieved product as a JSON response
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

// Function to fetch products within a specified price range
async function getProductsInRange(minPrice, maxPrice) {
    try {
         // Find products with prices within the specified range
        const productList = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

         // Check if productList is empty or null
        if (!productList || productList.length === 0) {
            return [];
        }

        return productList; // Return the list of products within the price range
    } catch (error) {
        console.error('Error fetching products by price range:', error);
        throw new Error('An error occurred while fetching products');
    }
}

// Route handler to get products within a specified price range
async function getProductsByPriceRange(req, res) {
    try {
         // Parse min and max prices from query parameters
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