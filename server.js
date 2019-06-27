app.get('/posts', (req, res) => {
    mongo.connect((url), (err, client) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            console.log('database connected');
            const db = client.db('TestDatabase');
            const collection = db.collection('TestCollection');
            collection.find().toArray((err, items) => {
                if (err) throw err;
                res.status(200).json(items);
            })
        }
        client.close(console.log('closed'));
    })
});

app.post('/login',(req,res)=>{
    mongo.connect((url), (err, client) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            console.log('database connected');
            const db = client.db('Reddit');
            const collection = db.collection('UserCollection');
            collection.find({ username: req.user }).toArray((err, items) => {
                if (err){
                    res.status(401).json({   
                        "message": "Wrong username or password." 
                      });
                }
                res.status(200).json(items);
            })
        }
        client.close(console.log('closed'));
    })
})