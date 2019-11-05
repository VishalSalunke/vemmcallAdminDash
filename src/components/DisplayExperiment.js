import React, {Component} from 'react'
import axios from 'axios'
import MaterialTable from 'material-table';


import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Paper from '@material-ui/core/Paper';
import { Grid, Link, Typography,Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  
    paper: {
      marginTop: theme.spacing(3),
      width: '100%',
      overflowX: 'auto',
      marginBottom: theme.spacing(2),
    },

      root: {
      padding: theme.spacing(3, 2),
      }
 
  }));




export default class DisplayExperiment extends Component{
    constructor(props){
        super(props)

        this.state = {
            experimentDetails : {},
            flows : [],
            ConsumerRequestColumns : [
                    {title:'Company ID',field:'company_id'},
                    {title:'Fill date',field:'fill_date'},
                    {title:'Created at',field:'created_at'},
                    {title:'ID',field:'id'},
                    {title:'consumer ID',field:'consumer_id'},
                    {title:'Request type',field:'request_type'},
                    {title:'Status',field:'status'},                   

            ],
            FlowA_consumerRequest : [],
            FlowB_consumerRequest : []
        }
    }


    fetchExperiment = async(id)=>{
		let res = await axios.get(`http://localhost:3000/react_api/v1/admin/experiments/${id}`,
					{
						crossDomain: true,						
					 	headers : {
									'access-token' : 'SPxukvxCwGULVdfyDE2daQ',
									'client' : 'SK9dW5VauJg2XH2jBTFp1w',
									'uid' : 'vsalunke@quinstreet.com'
								 }
					})
	
		let { data }  = res
		console.log(data)
	
        let experimentDetails  = data.message
        let flows = data.message.flows
        let FlowA_consumerRequest = []
        let FlowB_consumerRequest = []
                    
        for(let i=0; i< flows.length; i++){
            let consumer_requests = flows[i].consumer_requests
            
             for(let j=0; j< consumer_requests.length; j++){
                let floAdetails = {}
                floAdetails['company_id'] = consumer_requests[j]['company_id']
                floAdetails['fill_date'] = consumer_requests[j]['fill_date']
                floAdetails['created_at'] = consumer_requests[j]['created_at']
                floAdetails['id'] = consumer_requests[j]['id']
                floAdetails['consumer_id'] = consumer_requests[j]['consumer_id']
                floAdetails['request_type'] = consumer_requests[j]['request_type']
                floAdetails['status'] = consumer_requests[j]['status']

                i===0 ? FlowA_consumerRequest.push(floAdetails): FlowB_consumerRequest.push(floAdetails)
             }
            
        }
       
		this.setState({
            experimentDetails : experimentDetails,
            flows : flows,
            FlowA_consumerRequest : FlowA_consumerRequest,
            FlowB_consumerRequest : FlowB_consumerRequest
		})
	}
   
    componentDidMount(){
        let expId = this.props.history.location.pathname.match('([^/]+$)')[0]
        console.log(expId)
       
        if(this.props.history.location.state){
            let newExperiment =  this.props.history.location.state.newExperiment 
            this.fetchExperiment(newExperiment.id)
        }else if(expId){
            this.fetchExperiment(expId)
        }
        
    }


    render(){
        
        return(
            <>
                <h1>{this.state.experimentDetails.name}</h1>
                <Paper className={useStyles.root}>
				    <div style={{textAlign:"left" , margin:10}}>
				        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                                <Link color="inherit" href="/">
							            Dashboard
                                </Link>
                                <Link color="inherit" href="/experiments" >
                                        Experiments
                                </Link>
                                <Typography color="textPrimary">{this.state.experimentDetails.name}</Typography>
                        </Breadcrumbs>																						 
				    </div>
				</Paper>
                <Grid container spacing={3}>

                    <Grid item xs={3}>
                    <Paper className={useStyles.root}>
                   <h4> Description </h4> {this.state.experimentDetails.description}
                    </Paper>

                    </Grid>
                    <Grid item xs={3}>
                    <Paper className={useStyles.root}>
                    <h4>State </h4>  {this.state.experimentDetails.state}
                    </Paper>

                    </Grid>

                      {
                                this.state.flows.map((item,index)=>
                                    <Grid key={index} item xs={3}>
                                        <Paper className={useStyles.root}>
                                        <h4> Flow {index===0?'A':'B'} </h4> {item.name}
                                        </Paper>
                                    </Grid>
                                )
                      } 
                </Grid>
                    <br/>   
                    <Divider /> 
                <MaterialTable
                             title="Flow A - Consumer requests"
                             columns={this.state.ConsumerRequestColumns}
                             data={this.state.FlowA_consumerRequest}
                             
                />
                 <br/> 
                 <Divider />
                <MaterialTable
                             title="Flow B - Consumer requests"
                             columns={this.state.ConsumerRequestColumns}
                             data={this.state.FlowB_consumerRequest}
                             
                />   
            </>
        )
    }

    
}