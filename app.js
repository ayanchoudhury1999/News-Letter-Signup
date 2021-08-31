const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");
 
const app = express();
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
 
 
app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
});
 
mailchimp.setConfig({
    apiKey: 'ed3673b51f60df5a98aa604bf2be8a99-us6',
    server: 'us6'
});
 
 
app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const listId = '393f4d2490';
 
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
 
 
    const run = async () => {
        const response = await mailchimp.lists.batchListMembers(listId, {
          members: [{
              email_address: email,
              status: "subscribed",
              merge_fields: {
                  FNAME: firstName,
                  LNAME: lastName
              }
          }],
        }).then(responses => {
            console.log(responses);
            if(responses.id !== "") {
                res.sendFile(__dirname+"/success.html");
            }
 
          }).catch(err => {
                res.sendFile(__dirname+"/failure.html");
                console.log('Error')
          });
 
      };
      
      run();
 
});
 
app.post("/failure", function(req, res) {
    res.redirect("/");
});
 
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running at port 3000");
});
  // api key ed3673b51f60df5a98aa604bf2be8a99-us6
  // list id 393f4d2490