import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import Search from './search.js';
import Result from './result.js';
import '../css/sidebar.css';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button} from 'reactstrap';
const mql = window.matchMedia(`(min-width: 800px)`);

export default class Sidenav extends Component{

	constructor(props){
		super(props)

		this.state = {
			sidebarDocked: mql.matches,
			sidebarOpen: false,	
			dropdownOpen: false  
		};

		this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);

		this.searchElement = React.createRef();
	}

	componentWillMount() {
		mql.addListener(this.mediaQueryChanged);
	  }
	
	componentWillUnmount() {
		mql.removeListener(this.mediaQueryChanged);
	}

	onSetSidebarOpen(open) {
		this.setState({ sidebarOpen: open });
	}

	mediaQueryChanged() {
		this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
	}

	toggleDropdown() {
		this.setState(prevState => ({
		  dropdownOpen: !prevState.dropdownOpen
		}));
	  }

	render(){
		return(

			<Sidebar
				sidebar={
					<div className = "sidebar">
						<p>Welcome to Seedbase</p> 

						<Button color="success">Login</Button>

						<hr></hr>

						<p>Location</p>
						<Button color = "link">Set</Button>

						<hr></hr>

						<Dropdown className="filter-dropdown" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
							<DropdownToggle caret>
							Sort
							</DropdownToggle>
							<DropdownMenu>
							<DropdownItem header>Sort by</DropdownItem>
							<DropdownItem onClick={() => this.searchElement.current.handleSort(0)}>Default</DropdownItem>
							<DropdownItem onClick={() => this.searchElement.current.handleSort(1)}>Alphabetize</DropdownItem>
							<DropdownItem onClick={() => this.searchElement.current.handleSort(2)}>Low to High Price</DropdownItem>
							<DropdownItem onClick={() => this.searchElement.current.handleSort(3)}>High to Low Price</DropdownItem>
							<DropdownItem onClick={() => this.searchElement.current.handleSort(4)}>Popularity</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				}
				open={this.state.sidebarOpen}
				docked={this.state.sidebarDocked}
				onSetOpen={this.onSetSidebarOpen}
			>
				<Search ref = {this.searchElement} hidden = {this.state.sidebarOpen} />
			</Sidebar>

			);
	}
}
