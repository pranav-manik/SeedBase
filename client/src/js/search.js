import React, { Component } from 'react';
import { Input, Button, FormGroup, Label, Form } from 'reactstrap';
import Single from './card.js';
import axios from 'axios';


class Search extends Component{

	constructor(props){
		super(props)

		this.state = {
			search: "",
			results: null,
			isLoaded: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getData = this.getData.bind(this);
	}

	handleChange(event){
		this.setState({value: event.target.search});
		console.log(this.state.search);
	}

	handleSubmit(event){
		event.preventDefault();

		const input = document.getElementById("search");
		var search = input.value;

		console.log("Search Initiated: " + search);
		
		this.getData(search);

	}

	getData = async (search) => {
		console.log("Search: " + this.state.search);
		try{
			const response = await axios.get('http://localhost:4000/search', {
				params: {
					search : search
				}
			}).then((response) => {
				console.log("Spitting out resonse")
				console.log(response);
				this.setState({ results: response.data , isLoaded:true});
				console.log(response.data);
			})
		} catch (error) {
			console.error(error);
		}
	}

	render(){
		return(

			<div>
			<nav>
				<Form onSubmit={this.handleSubmit}>
					 <FormGroup>
				        <Input
				          type="search"
				          name="search"
				          id="search"
				          placeholder="Search"
						  class = "searchbar"
				    	 />
						<Button type="submit" color="primary"> Search </Button>
			        </FormGroup>
		        </Form>

			</nav>

			<div class = "result">

				{this.state.isLoaded ? 
					this.state.results.map(item => (
						<Single key = {item._id} seed={item._source}>Seed</Single>
						))
					:<p>Welcome to Seedbase, search up a seed to get started</p>
				}

			</div>

			</div>

			);
	}
}

export default Search;