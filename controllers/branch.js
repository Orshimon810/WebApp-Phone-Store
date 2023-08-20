const Branch = require('../models/branch');

async function getAllBranches (req,res) {
    const branchList = await Branch.find();

    if(!branchList){
        res.status(500).json({success:false});
    }
    res.send(branchList);
}

async function addBranch(req, res) {
    try {
        const branch = new Branch({
            address: req.body.address,
            coordinates: req.body.coordinates,
        });

        const createdBranch = await branch.save();
        res.status(201).json(createdBranch);
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
}


function deleteBranch(req, res) {
    Branch.findByIdAndDelete(req.params.id)
        .then(branch => {
            if (branch) {
                return res.status(200).json({ success: true, message: 'Branch has been deleted' });
            } else {
                return res.status(404).json({ success: false, message: 'Branch not found' });
            }
        })
        .catch(err => {
            return res.status(500).json({ success: false, error: err});
        });
}


async function getBranch(req,res){
    const branch = await Branch.findById(req.params.id);
    if(!branch){
        res.status(404).json({ success: false, message: 'Branch with this ID has not found' });
    }
    res.status(200).send(branch);
}
async function getCoordinates(req,res){
    const branch = await Branch.findById(req.params.id);
    if(!branch){
        res.status(404).json({ success: false, message: 'Branch with this ID has not found' });
    }
    res.status(200).send({coordinates:branch.coordinates});
}

async function updateBranch (req,res){
    const branch = await Branch.findByIdAndUpdate(
        req.params.id,
        {
            address: req.body.address,
            coordinates: req.body.coordinates,
        },
        {new:true}
    )

    if(!branch){
        return res.status(400).send('the branch cannot be Updated');
    }
    
    res.send(branch);
}


module.exports= {
   getAllBranches,
    addBranch,
    deleteBranch,
    getBranch,
    updateBranch,
    getCoordinates,
}