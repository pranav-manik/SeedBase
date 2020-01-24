import React, { Component } from 'react';
import Single from './card.js';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';

class Result extends Component{

    constructor(props){
        super(props);

        this.state = {
            response: [], 
            firstRequest: false
        };

        this.dataBySort = this.dataBySort.bind(this);
        this.compareString = this.compareString.bind(this);
        
        console.log(this.props.search);
    }

    getData = (search) => {
        console.log("Search: " + search);
        try{
            const response = axios.get('http://localhost:4000/search', {
                params: {
                    search : search
                }
            }).then((response) => {
                console.log("Spitting out resonse")
                console.log(response.data);
                this.setState({response: response.data, firstRequest: true});
            })
        } catch (error) {
            console.error(error);
            this.setState({response: [], firstRequest: true});
        }
    }

    dataBySort(sort_by) {

		if (this.state.response != null) {
			switch(sort_by) {
				//Default, no sorting
				case 0:
					console.log(sort_by);
					break;
				// alphebetize
				case 1:
					this.setState({response: this.state.response.sort(function (a, b) {
                          
                          if (a._source.variety < b._source.variety) {
                                  return -1;
                          }
                          else if (a._source.variety < b._source.variety) {
                                  return 1;
                          }
                          else return 0;


                        // return this.compareString(a, b, "ASC");
                    })});
					// console.log("Outputting resulets after alphabetization:" + this.state.response);
					break;
				// low to high pricing
				case 2:
					this.setState({response: this.state.response.sort( (a, b) => {
    					    if (a._source.min_price == null && b._source.min_price != null) {
    					        return 1
    					    }
    					    else if (b._source.min_price == null && a._source.min_price != null) {
    					        return -1
    					    }
                            else if (a._source.min_price == null && b._source.min_price == null) {
                                return 1
                            }
    					    return a._source.min_price - b._source.min_price;
					})});
				// high to low pricing
				case 3:
					this.setState({response: this.state.response.sort( (a, b) => {
                        try{
                            if (a._source.min_price == null && b._source.min_price != null) {
                                return 1
                            }
                            else if (b._source.min_price == null && a._source.min_price != null) {
                                return -1
                            }
                            else if (a._source.min_price == null && b._source.min_price == null) {
                                return 0
                            }
                            return b._source.min_price - a._source.min_price;
                        }
                        catch(err){
                            return 0
                        }
                    })});
					break;
				default:
					break;
        }
            // this.setState({response: results});
		}
    }
    
    // sortByPrice(a, b, order){

    //     if (a.prices.price_1 != undefined && b.prices.price_1 != undefined){

    //         var temp_a = (a.prices.price_1.replace("$", "").split('/')[0]);
    //         var temp_b = (b.prices.price_1.replace("$", "").split('/')[0]);

    //         if (order == "ASC"){
    //             return parseFloat(temp_b) - parseFloat(temp_a);
    //         }
    //         else if (order == "DEC"){
    //             return parseFloat(temp_a) - parseFloat(temp_b);
    //         }
    //     }

    // }

    compareString(a, b, order){
        console.log('in compare string')
        a = a.toLowerCase();
        b = b.toLowerCase();
        // console.log(a);
        // console.log(b);
        if (a == undefined){
            return -1;
        }

        if (b == undefined){
            return 1;
        }

        if (a == undefined && b == undefined){
            return 0;
        }

        if (order == "ASC"){
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        }
        else if (order == "DEC"){
            return (a > b) ? -1 : (a < b) ? 1 : 0;
        }
    }

    render(){
        return(
            <div className = "result">

                    {this.state.response.length ? 
                        this.state.response.map(item => (
                            <Single key = {item._id} seed={item._source}>Seed</Single>
                            ))
                        : ""
                    }
            </div>
        );
    }
}

export default Result;