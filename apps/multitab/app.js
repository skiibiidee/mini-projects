module.exports = ({app, path})=>{
    app.get('/multitab',(req,res)=>{
      res.sendFile(path.join(__dirname,'index.html'))
    })
  }