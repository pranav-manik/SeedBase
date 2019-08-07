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
	}

	handleChange(event){
		this.setState({value: event.target.search});
		console.log(this.state.search);
	}

	handleSubmit(event){
		event.preventDefault();

		const input = document.getElementById("search");
		var search = input.value;

		alert("Search Initiated: " + search);
		// this.setState({ isLoaded: false });

		axios.get('http://localhost:4000/search?search=' + search)
			.then(res => {
				this.setState( { results: res.data });
			})

		console.log("Hello");

		this.setState({ isLoaded: true });

	}



	render(){
		return(

			<div>
			<nav>
				<Form>
					 <FormGroup>
				        <Input
				          type="search"
				          name="search"
				          id="search"
				          placeholder="Search"
				          class = "searchbar"
				        />
			        </FormGroup>
		        </Form>
				<Button onClick={this.handleSubmit}> Search </Button>

			</nav>

			<div class = "result">

				{this.state.isLoaded ? 
					this.state.results.map(item => (
						<Single seed={item}>Seed</Single>
						))
					:null
				}

			</div>

			</div>

			);
	}
}

export default Search;