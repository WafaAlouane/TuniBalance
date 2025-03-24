export default ()=>({
    jwt:{
        secret:process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    database:{
        connectionString: process.env.Mongo_Url,
    },
});