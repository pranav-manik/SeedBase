

import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import Search from './search.js';
import Result from './result.js';
import '../css/sidebar.css';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';

import{Button, Divider, Menu, MenuItem, MenuDivider} from "@blueprintjs/core";

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
						<h2 class="bp3-heading">Seedbase</h2>

						<Button icon="log-in" text="Login"/>

						<Divider vertical={true} className="top-20 bottom-20"/>

						<h4 class="bp3-heading">Location</h4>
						<Button icon="geosearch" text="Set"/>

						<Divider vertical={true} className="top-20 bottom-20"/>

						<h4 class="bp3-heading">Filters</h4>

						<Menu>
							<MenuDivider title="Sort"/>
							<MenuItem text="Default" onClick={() => this.searchElement.current.handleSort(0)}/>
							<MenuItem text="Alphabetize" onClick={() => this.searchElement.current.handleSort(1)}/>
							<MenuDivider title="Price"/>
							<MenuItem text="Low to High" onClick={() => this.searchElement.current.handleSort(2)}/>
							<MenuItem text="High to Low" onClick={() => this.searchElement.current.handleSort(3)}/>
							<MenuDivider/>
							<MenuItem text="Popularity" onClick={() => this.searchElement.current.handleSort(4)}/>
						</Menu>
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
