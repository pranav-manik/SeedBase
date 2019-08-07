import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Collapse } from 'reactstrap';

class Single extends Component{

	constructor(props){
		super(props);

		this.state = {
			// variety: "",
			// name: "",
			// category: "",
			// manufacturer: "",
			// mat_min: "",
			// mat_max: "",
			// life_cycle: "",
			// hybrid_status: "",
			// prices: Map,
			// organic: Boolean,
			// url: "",
			// timestamp: Date
			isExpanded: false
		};
	}

	toggleExpand = () => {
		this.setState(state => ({ isExpanded: !state.isExpanded }));
	}

	render(){
		const {data}=this.props;
		return(

		      <Card>
		        <CardBody>
		          <CardTitle>Variety: {this.state.variety}</CardTitle>
		          <CardSubtitle>Card subtitle</CardSubtitle>
		          <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
		          <Button onClick={this.toggleExpand}>Button</Button>
		        </CardBody>
		      </Card>

		      // {this.state.isExpanded ?
		      // 	<Card class = "carddetails">
		      //       <CardBody>
		      //       Anim pariatur cliche reprehenderit,
		      //        enim eiusmod high life accusamus terry richardson ad squid. Nihil
		      //        anim keffiyeh helvetica, craft beer labore wes anderson cred
		      //        nesciunt sapiente ea proident.
		      //       </CardBody>
	       //   	 </Card>
        //  	 : null}

			);
	}
}

export default Single;