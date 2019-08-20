import React, { Component } from 'react';
import Single from './card.js';
import axios from 'axios';

class Result extends Component{

    constructor(props){
        super(props);

        this.state = {
            response: [], 
            firstRequest: false
        };

        console.log(this.props.search);
    }

    getData = (search) => {
        console.log("Search: " + search);
        try{
            const response = axios.get('http://localhost:4000/search', {
                params: {
                    search : search
                }
            }).then((response) => {
                console.log("Spitting out resonse")
                console.log(response.data);
                this.setState({response: response.data, firstRequest: true});
            })
        } catch (error) {
            console.error(error);
            this.setState({response: [], firstRequest: true});
        }
    }


    render(){
        return(
            <div className = "result">
				{this.state.response.length ? 
					this.state.response.map(item => (
						<Single key = {item._id} seed={item._source}>Seed</Single>
						))
					:<p>No results</p>
                }
            </div>
        );
    }
}

export default Result;