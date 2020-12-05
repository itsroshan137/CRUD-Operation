const express = require("express");
const app = express();

const portNumber = process.env.PORT || 5000;

const mongodb = require("mongodb");
const { request, response } = require("express");
const connStringURL = "mongodb+srv://root:password@dbname.0ln56.mongodb.net/";
//connection string url has changed for security reasons
const mongodbClient = mongodb.MongoClient;

app.listen(portNumber, ()=>{
    console.log("App has been started to port: " + portNumber);
});

app.get("/", (request, response) =>{
    console.log("My web Page init");
    return response.status(200).send("<h2> We are Live..</h2>");
})

//crud
//insert operation
app.post("/insert-student", (request, response) => {
    const studentInfo = {
        fullName : request.query.fullName,
        gender: request.query.gender,
        address: request.query.address,
        phoneno: request.query.phoneno
    }

    //reaching to mongodb server
    mongodbClient.connect(connStringURL, { useUnifiedTopology: true }, (error, database)=>{
        if(error) return response.status(500).json({status: 500, error: error})

        //connecting to database
        const dbobj = database.db("student");
        dbobj.collection("first-semester").insertOne(studentInfo, { useUnifiedTopology: true }, (err, result) => {
            if(err) return response.status(500).json({ status: 500, err: err});
            database.close();
            return response.status(200).json({status:200, result: "New Data added to database!!"})
        })
    })
})

app.post("/select-all-student", (request, response) => { // SELECT * FROM table_name 
    
    mongodbClient.connect(connStringURL,{ useUnifiedTopology: true }, (error, database) => {
        if(error) return response.status(500).json({ status: 500, error:error});

        //Select All from db
        const dbboj = database.db("student");
        dbboj.collection("first-semester").find({ }).toArray((err, result) => {
            if(error) return response.status(500).json({ status: 500, err:err});
            database.close();

            return response.status(200).json({status:200, result:result})
        })
    })
})

app.post("/student-update", (request, response) => {    //UPDATE first-semester SET address='xxx', gender='xxx', name= 'xxx', phoneno= '', WHERE _id ='xxx';
    const studentID = {
        _id: new mongodb.ObjectID(request.query._id)
    }
    const studentInfo = {
        fullName: request.query.fullName,
        address: request.query.address,
        gender: request.query.gender,
        phoneno: request.query.phoneno,
    }

    //connect to db 
    mongodbClient.connect(connStringURL, { useUnifiedTopology: true }, (error, database) => {
        if(error) return response.status(500).json({ status: 500, error: error });
        
        // update operation
        const dbobj = database.db("student");
        dbobj.collection("first-semester").updateOne(studentID, {$set: studentInfo}, (err, result) => {
            if(error) return response.status(500).json({status: 500, err: err})
            database.close();

            return response.status(200).json({status: 200, result: "Update successful..."});
        });
    });
});

app.post("/student-delete", (request, response) => {    // Delete from students where _id ="" ;
    const studentID = {
        _id: new mongodb.ObjectID(request.query._id)
    }
    mongodbClient.connect(connStringURL, { useUnifiedTopology: true }, (error, database) => {
        if(error) return response.status(500).json({status:500, error: error});

        //delete
        const dbobj = database.db("student");
        dbobj.collection("first-semester").deleteOne(studentID, (err, result) => {
            if(err) return response.status(500).json({status:500, error: err});
            database.close();

            return response.status(200).json({status:200, reult: "Succesfully Deleted..."});
        });
    });
});

app.post("/select-single-student", (request, response) => { // SELECT * FROM table_name 
    
    const studentID = {
        _id: new mongodb.ObjectID(request.query._id)
    }

    mongodbClient.connect(connStringURL,{ useUnifiedTopology: true }, (error, database) => { //SELECT * FROM student WHERE id = "XXX";
        if(error) return response.status(500).json({ status: 500, error:error});

        //Select All from db
        const dbboj = database.db("student");
        dbboj.collection("first-semester").findOne(studentID, (err, result) => {  
            if(err) return response.status(500).json({status:500, error: err});
            database.close();

            return response.status(200).json({status:200, result:result});
        });
    })
    
})
