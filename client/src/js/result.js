// //Not Needed 

// import React, { Component } from 'react';
// import axios from 'axios';
// import Single from './card.js';


// class Result extends Component{

// 	constructor(props) {

// 		super(props);

// 		this.state = {
// 			results: null,
// 			isLoading : false,
// 		};		
// 	}

// 	componentDidMount() {
// 		this.setState({isLoading: true});

// 		axios.get('http://localhost:4000/search?search=peas')
// 			.then(res => {
// 				this.setState( { results: res.data });
// 				this.setState( {isLoading: false })
// 			})

// 		console.log("result rendered");

// 	}

// 	// getQuery() {
// 	// 	var search = props.search;
// 	// 	axios.get('http://localhost:4000/search?search=' + search)
// 	// 		.then(res => {
// 	// 			this.setState( { results: res.data });
// 	// 		})
// 	// }


// 	render(){
// 		console.log(this.state.data);
// 	 	return(
// 			"result"
// 	 		);	 	
// 	}

// }

// export default Result;