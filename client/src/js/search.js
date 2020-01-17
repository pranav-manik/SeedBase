import React, { Component } from 'react';
import {
	Navbar,
	NavbarGroup,
	InputGroup
} from "@blueprintjs/core";


import Result from './result.js';
import '../css/search.css';

const mql = window.matchMedia(`(min-width: 800px)`);

class Search extends Component{

	constructor(props){
		super(props);

		this.state = {
			search: "",
			sort: 0
		};

		this.resultElement = React.createRef();
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		mql.addListener(this.mediaQueryChanged);
	  }
	
	componentWillUnmount() {
		mql.removeListener(this.mediaQueryChanged);
	}

	handleSort(sortNum){
		this.setState({sort: sortNum});
		this.resultElement.current.dataBySort(sortNum);
	}

	handleChange(event){
		console.log(event);
		this.setState({value: event.target.search});
		console.log(this.state.search);
	}

	handleSubmit(event){
		event.preventDefault();

		const input = document.getElementById("search");
		var search = input.value;

		console.log("Search Initiated: " + search);
		this.setState({search: search});
		this.resultElement.current.getData(search);
	}

	render(){
		return(
			<div>

			<Navbar>
				<NavbarGroup>
					<InputGroup
						placeholder='Search seeds'
						leftIcon='search'
						round='true'
						onChange={this.handleSubmit}
						id="search"
					/>
				</NavbarGroup>
			</Navbar>

			<Result ref={this.resultElement}/>

			</div>

			);
	}
}

export default Search;