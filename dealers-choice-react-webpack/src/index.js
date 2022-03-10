import axios from 'axios';
import React from 'react'
import ReactDOM from 'react-dom'


export default class App extends React.Component{
    constructor(){
        super();
        this.state = {
            trainers:[]
        }
        this.create = this.create.bind(this)

    }
    async create(){
        console.log('create')
        const response = await axios.post('/api/trainers');
        const trainer = response.data;
        const trainers = [...this.state.trainers, trainer];
        this.setState({trainers});
    }
    async delete(trainer){
        await axios.delete(`/api/trainers/${trainer.id}`)
        console.log(trainer.id)
        const trainers = this.state.trainers.filter((_trainer)=>{
            return _trainer.id !== trainer.id
        })
        console.log(trainers)
        this.setState({trainers})
    }

    async componentDidMount(){
        const response = axios.get('/api/trainers');
        this.setState({trainers:(await response).data})
    }
    render(){
        return(
            <div>
                <h1>
                    POKEMON Trainer
                </h1>
                <button onClick={this.create}>Create New Trainer</button>
                <p></p>
                {this.state.trainers.map((trainer)=>{
                    return <li key={trainer.id}>{trainer.name}<button onClick={()=>this.delete(trainer)}>x</button></li>
                })}
            </div>
            
    )}
}

const root = document.querySelector('#root');
ReactDOM.render(<App />, root)
 