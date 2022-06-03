
const express = require('express')
const app = express()
var path = require('path');


const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-_abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 5);


app.use(express.json())
app.use(express.urlencoded({
  extended:true
}));

const port = 3002

var compiler = require('compilex');
var option = {stats : true};
compiler.init(option);

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})


app.get('/getID',(req,res) =>{
  res.send(nanoid());
})
app.get('/delete', (req, res) => {
  compiler.flush(function(){
    console.log('All temporary files flushed !'); 
    });
  res.send('Delete Success!')
})

app.post('/compilecode' , function (req , res ) {

	var code = req.body.code;	
	var input = req.body.input;
  var lang = req.body.language;
  console.log(lang)
  
  if((lang === "c") || (lang === "cpp"))
  {   
    if(input === ""){
        var envData = { OS : "windows" , cmd : "g++", options: {timeout:1000 }};	   
          compiler.compileCPP(envData , code , function (data) {
            res.send(
            {
              error:!!data.error ? data.error :'',
              output:!!data.error ? '':data.output.replaceAll('\r','')
            });
          });
    }     
    else{    
      var envData = { OS : "windows" , cmd : "g++", options: {timeout:1000 }};	   	
      compiler.compileCPPWithInput(envData , code ,input , function (data) {
        res.send(
          {
            error:!!data.error ? data.error :'',
            output:!!data.error ? '':data.output.replaceAll('\r','')
          });
      });
    }
  
  }
  // if(lang === "Java")
  // {
  //     if(inputRadio === "true")
  //     {
  //         var envData = { OS : "windows" };     
  //         console.log(code);
  //         compiler.compileJavaWithInput( envData , code , function(data){
  //             res.send(data);
  //         });
  //     }
  //     else
  //     {
  //         var envData = { OS : "windows" };     
  //         console.log(code);
  //         compiler.compileJavaWithInput( envData , code , input ,  function(data){
  //             res.send(data);
  //         });

  //     }

  // }
  // if( lang === "Python")
  // {
  //     if(inputRadio === "true")
  //     {
  //         var envData = { OS : "windows"};
  //         compiler.compilePythonWithInput(envData , code , input , function(data){
  //             res.send(data);
  //         });            
  //     }
  //     else
  //     {
  //         var envData = { OS : "windows"};
  //         compiler.compilePython(envData , code , function(data){
  //             res.send(data);
  //         });
  //     }
  // }
  // if( lang === "CS")
  // {
  //     if(inputRadio === "true")
  //     {
  //         var envData = { OS : "windows"};
  //         compiler.compileCSWithInput(envData , code , input , function(data){
  //             res.send(data);
  //         });            
  //     }
  //     else
  //     {
  //         var envData = { OS : "windows"};
  //         compiler.compileCS(envData , code , function(data){
  //             res.send(data);
  //         });
  //     }

  // }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

compiler.flush(function () {
  console.log("All temporary files flushed !");
});