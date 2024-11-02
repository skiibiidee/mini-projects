module.exports = ({app, path})=>{
    app.get('/htmlloader',(req,res)=>{
      res.sendFile(path.join(__dirname,'index.html'))
    })
  }