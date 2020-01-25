import React, { Component } from 'react';
import { Card, Elevation, Button, Collapse } from "@blueprintjs/core";
import '../css/card.css'
import '@fortawesome/fontawesome-free/css/all.css';

class Single extends Component{

	constructor(props){
		super(props);

		this.state = {
			isExpanded: false
		};
	}

	toggleExpand = () => {
		this.setState(state => ({ isExpanded: !state.isExpanded }));
	}

	render(){
		const seed = this.props.seed;
		const prices = seed.prices;
		return(

			<div>
		      <Card onClick={this.toggleExpand} elevation={Elevation.TWO} className="item">

				<div className = "imgbox">
					<img className = "cardimg" src = {seed.img_url}></img>
				</div>
				
				<div className="contentbox">

					<h4 className="bp3-heading"><span>{seed.manufacturer}</span> • {seed.variety} {seed.name}</h4>

					<ul>
						<li><b>Maturity:</b> {seed.mat_min == seed.mat_max ? (seed.maturity): seed.mat_min.toString() + "-" + seed.mat_max.toString()} Days | <b>Life Cycle:</b> {seed.life_cycle ? "" : "Unavailable"}</li>
						<li><b>Hybrid Status:</b> {seed.hybrid_status}</li>
						<li><b>Organic:</b> {seed.organic ? ("Yes"): "No"}</li>
					</ul>
					
					<span>{!this.state.isExpanded ? "Click to expand prices" : ""}</span>
					<Collapse isOpen={this.state.isExpanded}>
						<b>Prices:</b>
						<ul className="prices">						
							{prices ?  
								Object.keys(prices).map((key, index) => (
									<li key={index}>{prices[key]}</li>
								)) : "No pricing data available" }
						</ul>

					</Collapse>
					
				</div>

				<div className="pricebox">
					<h2>{prices ? prices.price_1 : "N/A"}</h2>
					<a target="_blank" className = "link" href = {seed.url}><i className="fas fa-shopping-basket fa-2x"></i></a>		
				</div>
		        
		      </Card>


			</div>

			);
	}
}

export default Single;