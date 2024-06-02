// const asyncHandler = ()=>{

// }

// const asyncHandler = (fn)=> async(req,res,next)=>{

//     try {

//         await fn(req,res,next)
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
        
        
//     }
    



// }

// ye file promises ko handle karegi bas!!!!!

const asyncHandler = (requestHandler)=>{
    return (req,res,next) => {
        Promise.resolve(requestHandler)
        .catch((err) => next(err))
    }

}

export { asyncHandler }
