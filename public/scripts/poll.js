
var Main = React.createClass({
    getInitialState: function() {
        return {poll: {question: '', answers: []}, view: 'form', selected: 0};
    },
    loadPoll: function() {
        $.get(
            'https://vote-app-jjamesg.c9users.io/poll/p/' + this.props.path, 
            function(poll) {
                this.setState({poll: poll});
            }.bind(this)
        );
    },
    componentDidMount: function() {
        this.loadPoll();
        $.get(
            '//freegeoip.net/json/',
            function(location) {
                console.log(location.ip)
                this.setState({ip: location.ip});
            }.bind(this)
        );
    },
    handleSelect: function(e) {
        this.setState({selected: e.target.value}, function(){
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();

        var votes = this.state.poll.votes;
        votes[this.state.selected]++;
        
        console.log(this.state.ip)
        $.post(
            'https://vote-app-jjamesg.c9users.io/poll/p',
            {pollId: path, votes: votes, ip: this.state.ip},
            function(data) {
                this.setState({votes: votes});
                this.setState({view: 'results'});
            }.bind(this));
           
        
        
    },
    render: function() {
        if(this.state.view == 'form') {
            return (
                <div className='poll-main'>
                    <div className='question-out'>{this.state.poll.question}</div>
                    <AnswerForm 
                        answers={this.state.poll.answers}
                        submit={this.handleSubmit}
                        click={this.handleSelect}
                    />
                </div>
        )}
        if(this.state.view == 'results') {
            var totVotes = this.state.votes.reduce(function(p, n) {
                return +p + +n;
            })
            return (
                <div className='poll-main'>
                    <div className='question-out'>{this.state.poll.question}</div>
                    <Results 
                        answers={this.state.poll.answers}
                        votes={this.state.votes}
                        totVotes={totVotes}
                    />
                    <div className='tot-votes'>{'Total Votes: ' + totVotes}</div>
                </div>
        )}
    }
});

var AnswerForm = React.createClass({
    getInitialState: function() {
        return({answers: []})
    },
    render: function() {
        var answerNodes = (this.props.answers || []).map(function(answer,i) {
            return (
                <div className='answer-out'>
                    <input 
                        type="radio" 
                        name="answer" 
                        value={i} 
                        defaultChecked={!i}
                        onClick={this.props.click}
                    /> 
                        {answer} 
                </div>
            )
        }.bind(this))
        return (
            <form onSubmit={this.props.submit}>
                {answerNodes}
                <input className='vote' type="submit" value='Vote'/>
            </form>
        )
    }
})

var Results = React.createClass({
    render: function() {
        var answerNodes = this.props.answers.map(function(answer,i) {
            console.log(this.props.totVotes)
            var percentage = Math.floor(this.props.votes[i] / this.props.totVotes * 100) + '%';
            return (
                <div className='answer-out'>{answer + ': ' + percentage}</div>
            )
        }.bind(this))
        return (
            <div>
                {answerNodes}  
            </div>
        )
    }
})

var path = document.URL.split('/').reverse()[0];


ReactDOM.render(<Main path={path} />, document.getElementById('content'));