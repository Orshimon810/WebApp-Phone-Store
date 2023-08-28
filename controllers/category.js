const Category = require('../models/category');
const mongoose = require('mongoose');

async function getAllCategories (req,res) {
    const categoryList = await Category.find();

    if(!categoryList){
        res.status(500).json({success:false});
    }
    res.send(categoryList);
}

async function addCategory(req, res) {
    try {
        const category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
}

function validateCategoryId(req, res, next) {
    const category = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }
  
    next();
  }

function deleteCategory(req, res) {
    Category.findByIdAndDelete(req.params.id)
        .then(category => {
            if (category) {
                return res.status(200).json({ success: true, message: 'Category has been deleted' });
            } else {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: false, error: err});
        });
}


async function getCategory(req,res){
    const category = await Category.findById(req.params.id);
    if(!category){
        res.status(404).json({ success: false, message: 'Category with this ID has not found' });
    }
    res.status(200).send(category);
}

async function updateCategory (req,res){
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        {new:true}
    )

    if(!category){
        return res.status(400).send('the category cannot be Updated');
    }
    
    res.send(category);
}




module.exports= {
    getAllCategories,
    validateCategoryId,
    addCategory,
    deleteCategory,
    getCategory,
    updateCategory,
}