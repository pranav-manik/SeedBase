import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Collapse } from 'reactstrap';

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
		return(

			<div>
		      <Card>
		        <CardBody>
		          <CardTitle>Variety: {seed.variety}</CardTitle>
		          <CardSubtitle>Manufacturer: {seed.manufacturer}</CardSubtitle>
		          <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>

				  <Collapse isOpen={this.state.isExpanded}>
					<CardSubtitle>Maturity: {seed.maturity}</CardSubtitle>
					<CardSubtitle>Life Cycle: {seed.life_cycle}</CardSubtitle>
					<CardSubtitle>Hybrid Status: {seed.hybrid_status}</CardSubtitle>
					{/* seed.prices.map(price => (
						<li key = {price.name}>{price.key}</li>
						) */}
				</Collapse>

		          <Button outline color="info" class = "expand" onClick={this.toggleExpand}>Expand</Button>
				  <a target="_blank" class = "link" href = {seed.url}>View on Distributor's Website</a>
		        </CardBody>
		      </Card>


			</div>

			);
	}
}

export default Single;