import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import Search from './search.js';
import Result from './result.js';
const mql = window.matchMedia(`(min-width: 800px)`);

export default class Sidenav extends Component{

	constructor(props){
		super(props)

		this.state = {
			sidebarDocked: mql.matches,
      		sidebarOpen: false	
		};

		this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    	this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
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

	render(){
		console.log('Sidenav rendered');
		return(

			<Sidebar
				sidebar={<b>Sidebar content</b>}
				open={this.state.sidebarOpen}
				docked={this.state.sidebarDocked}
				onSetOpen={this.onSetSidebarOpen}
			>
				<Search hidden = {this.state.sidebarOpen} />
			</Sidebar>

			);
	}
}
