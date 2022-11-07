module.exports = (req,res,next)=>{

    if(!req.session.isLoggedIn){
        return res.redirect('/login')
    }
    next()
}   

// module.exports = (roles)=>{
//     return (req,res,next) =>{
//         if(req.session.isLoggedIn){
//             if(roles.includes(req.user.role)){
//                 return next()
//             }
//         }
//         return res.redirect('/login')
//     }
// }