import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Collapse, Col, Row } from 'reactstrap';

import '../css/card.css'
import '@fortawesome/fontawesome-free/css/all.css';

class Single extends Component{

	constructor(props){
		super(props);

		this.state = {
			isExpanded: false
		};

		this.toggleExpand = this.toggleExpand.bind(this);
	}

	toggleExpand = () => {
		this.setState(state => ({ isExpanded: !state.isExpanded }));
	}

	render(){
		const seed = this.props.seed;
		const prices = seed.prices;
		return(

			<div>
		      <Card onClick={this.toggleExpand}>
		        <Row>
				<Col sm="2" className = "centered">
					<i className="fas fa-carrot fa-2x"></i>
				</Col>

				<Col sm="7">
					<CardTitle>{seed.variety} {seed.name}</CardTitle>
					<CardSubtitle><b>Disributor:</b> {seed.manufacturer}</CardSubtitle>
					<CardSubtitle><b>Maturity:</b> {seed.mat_min == seed.mat_max ? (seed.maturity): seed.mat_min.toString() + "-" + seed.mat_max.toString()} Days | <b>Life Cycle:</b> {seed.life_cycle}</CardSubtitle>
					<CardSubtitle><b>Hybrid Status:</b> {seed.hybrid_status}</CardSubtitle>
					<CardSubtitle><b>Organic:</b> {seed.organic ? ("Yes"): "No"}</CardSubtitle>
					
					<Collapse isOpen={this.state.isExpanded}>
						<CardSubtitle><b>Prices:</b></CardSubtitle>
						<ul>						
							{prices ?  
								Object.keys(prices).map((key, index) => (
									<li key={index}>{prices[key]}</li>
								)) : "No pricing data available" }
						</ul>

					</Collapse>
					
				</Col>

				<Col sm="3" className = "centered">
						<CardSubtitle><b>{prices ? prices.price_1 : "N/A"}</b></CardSubtitle>
						<a target="_blank" className = "link" href = {seed.url}><i className="fas fa-shopping-basket fa-2x"></i></a>		
				</Col>
				</Row>
		        
		      </Card>


			</div>

			);
	}
}

export default Single;