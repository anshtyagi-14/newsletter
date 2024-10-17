const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

let app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",(req,res)=>{
    let first=req.body.first;
    let last=req.body.last;
    let email=req.body.email;
    let data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:first,
                    LNAME: last
                }
            }
        ]
    }
    var jsonData= JSON.stringify(data);

    const url='https://us11.api.mailchimp.com/3.0/lists/35612bcb5e';
    const options={
        method:"POST",
        auth:"ansh:4fd94a388c316364cf2efbc1e487b4e0-us11"
    }

    const request=https.request(url,options,(response)=>{

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        };

        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end(); 
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});
  

app.listen(process.env.PORT || 3000,()=>{
    console.log("server running on 3000");
});
