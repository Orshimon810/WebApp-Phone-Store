function errorHandler(err,req,res,next){
    //JSON WEB TOKEN authentication Error -> providing wrong token
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({message:'The user is not authorized'});
    }

    //Validation error
    if(err.name === 'ValidationError'){
        res.status(401).json({message:err});
    }

    //all other errors
    return res.status(500).json({message:err});
}

module.exports = errorHandler;