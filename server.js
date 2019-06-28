app.get('/posts', (req, res) => {
    mongo.connect((url), (err, client) => {
        if (err) {
            return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
        } else {
            const db = client.db('TestDatabase');
            const collection = db.collection('TestCollection');
            collection.find().toArray((err, items) => {
                if (err) throw err;
                res.status(200).json(items);
            })
        }
        client.close();
    })
});

app.post('/login', (req, res) => {
    // 3. Endpoint returns error on missing content-type.    
    req.setRequestHeader('Accept', 'application/json')
    req.setRequestHeader('Content-Type', 'application/json');
    //{ "message": "Content-type is not specified." }
    if (req.username.length < 1) {
        res.status(400).json({
            "message": "Missing username."
        })
    }
    else if (req.password.length < 1) {
        res.status(400).json({
            "message": "Missing password."
        })
    } else {
        mongo.connect((url), (err, client) => {
            if (err) {
                return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
            } else {
                const db = client.db('Reddit');
                const collection = db.collection('UserCollection');
                collection.find({ username: req.username, password: req.password }).toArray((err, items) => {
                    if (err) {
                        res.status(401).json({
                            'message': 'Wrong username or password.'
                        });
                    } else {
                        let response = {
                            _id: items._id,
                            username: items.username,
                            token: items.token,
                            refreshToken: items.refreshToken
                        }
                        res.status(200).json(response);
                    }
                })
            }
            client.close();
        })
    }
})