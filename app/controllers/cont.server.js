module.exports = function(db, ObjectId) {
  
    this.handleNewPoll = function(req, res) {
        var votesArray = new Array(req.body.answers.length+1)
            .join('0')
            .split('')
            .map(parseFloat);
        
        var answers = req.body.answers.filter(Boolean);
        
        console.log(answers)
        
        db.collection('polls').insertOne({
            question: req.body.question,
            answers: answers,
            votes: votesArray
            },
            function(e, r) {
                res.send(r.insertedId);
            }
        );
        
    };
    
    //add ip shit
    
    this.handleVote = function(req, res) {
        console.log(req.body.pollId, req.body.votes, req.body.ip)
        db.collection('polls').updateOne(
            {_id: ObjectId(req.body.pollId)} ,
            { $set: { votes: req.body.votes } },
            function(e, result) {
                console.log('result function', e, result)
                res.send(result);
            }
        );
    };
    
    this.getPoll = function(req, res) {
        db.collection('polls').findOne(
            {_id: ObjectId(req.params.id)},
            function(e, poll) {
                res.send(poll);
            })
    };

    
};