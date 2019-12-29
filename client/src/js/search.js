import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, FormGroup, Label, Form , Row, Col, Navbar} from 'reactstrap';
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
				<Row>
					<Col sm="6" className="centered">
						<Form onSubmit={this.handleSubmit}>
							 <FormGroup>
						        <Input
						          type="search"
						          name="search"
						          id="search"
						          placeholder="Search"
								  className = "searchbar"
						    	 />
								<Button type="submit" color="link"> <i class="fas fa-search"></i> </Button>
					        </FormGroup>
				        </Form>
					</Col>
				</Row>
			</Navbar>

			<Result ref={this.resultElement}/>

			</div>

			);
	}
}

export default Search;