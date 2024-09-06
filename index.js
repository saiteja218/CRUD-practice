const http=require('http');
PORT=5000;
const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        res.write("hello boss");
        res.end();
    }
    if(req.url=='/users'){
        res.write("users data");
        res.end();
    }
});



server.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})