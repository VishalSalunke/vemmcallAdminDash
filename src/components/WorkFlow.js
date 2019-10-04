import React , { Component } from 'react'
import { BrowserRouter as Router , Link , Route } from 'react-router-dom'
import  ManageWorkflow  from './ManageWorkflow'
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles';

import {  Button , 
		Grid  , Dialog , DialogTitle , DialogContent , DialogContentText , DialogActions , TextField
} from '@material-ui/core';

import MaterialTable from 'material-table';
//import { Icons } from '@material-ui/icons'


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  tableMargin: {
  	margin : 10,
  	marginLeft : 10,
  	height : 'auto'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  createFlowContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  } 
}));

 class WorkFlow extends Component {
 		constructor(props){

 			super(props)
 			
 			this.state = {
	
			workFlowListColumns: [
     					 { title: 'Name', field: 'name' },
      					 { title: 'Discription', field: 'description' },
     											
    				],

    		workFlowListData: [ ],
    		CreateFlowDialoge : false,
    		DisplayWorkflowHome : true,
    		wokFlowName : '',
    		WorkFlowDescription : ''

			}	
 		}

 		openCreateFlowDialog = () => {
 				this.setState({
 					CreateFlowDialoge : true
 				})
 		}

 		handleDialogClose = () => {
 				this.setState({
 					CreateFlowDialoge : false
 				})
 		}

 		handleCreateFlow = () => {
 				this.setState({
 					DisplayWorkflowHome : false,
 					CreateFlowDialoge : false
 				})
 		} 

 		handleChange = ({ target }) => {
 				this.setState({
      					[target.name]: target.value
    			});
 		}



 		handleSubmit = () => {
 			console.log(" form submitted ")
 		}

 		fetchWorkFlowList = () => {
 				axios.get('http://localhost:3000/react_api/v1/admin/flows/flows',{
 				headers : {
 					'access-token' : 'M1fCUjQHAGMO1x_CqV1Kuw',
 					'client' : 'CPCFC0DUyVOgbpvRV91hLQ',
 					'uid' : 'vsalunke@quinstreet.com'

 				},
 				crossDomain: true
 			})
  			.then(response => {
   			 	console.log(response);
   		    	response.data.flows.map( item => {
   		    	 		this.setState({
 							workFlowListData : [ ...this.state.workFlowListData , item]
 						}) 
   		    	})
  			})
  			.catch(error => {
  			 			 console.log(error);
  			}); 

 		}


 		componentDidMount() {

  					this.fetchWorkFlowList()
 			
  		}

  	createWorkFlow = () => {
  

    		axios.post('http://localhost:3000/react_api/v1/admin/flows/create_flow',

    		{
    			crossDomain: true,
 				name: this.state.wokFlowName,
				description: this.state.WorkFlowDescription
    		},

    		{
 				headers : {
 					'access-token' : 'M1fCUjQHAGMO1x_CqV1Kuw',
 					'client' : 'CPCFC0DUyVOgbpvRV91hLQ',
 					'uid' : 'vsalunke@quinstreet.com'
 				}
 			}	
	
 			)
  			.then(response => {
   			 	console.log(response);
   			 	this.setState({
 					CreateFlowDialoge : false
 				})
   		    	
  			})
  			.catch(error => {
  			 			 console.log(error);
  			}); 



  	}

  	updateWorkFlow = (newData) => {
  
  		console.log(newData)
  		let id = newData.id
  		let NewName =  newData.name
  		let NewDescription =  newData.description
  		
  		   axios.put(`http://localhost:3000/react_api/v1/admin/flows/${id}`,

    		{
    			crossDomain: true,
 				name: NewName,
				description: NewDescription
    		},

    		{
 				headers : {
 					'access-token' : 'M1fCUjQHAGMO1x_CqV1Kuw',
 					'client' : 'CPCFC0DUyVOgbpvRV91hLQ',
 					'uid' : 'vsalunke@quinstreet.com'
 				}
 			}	
	
 			)
  			.then(response => {
   			 	console.log(response);
   		    	
  			})
  			.catch(error => {
  			 			 console.log(error);
  			}); 

  	}

  	deleteWorkFlow = (newData) => {
  
  		console.log(newData)
  		let id = newData.id
  		let NewName =  newData.name
  		let NewDescription =  newData.description
  		
  		   axios.delete(`http://localhost:3000/react_api/v1/admin/flows/${id}`,

    		{
 				headers : {
 					'access-token' : 'M1fCUjQHAGMO1x_CqV1Kuw',
 					'client' : 'CPCFC0DUyVOgbpvRV91hLQ',
 					'uid' : 'vsalunke@quinstreet.com'
 				}
 			},
 			
    		{
    			crossDomain: true,
 				name: NewName,
				description: NewDescription
    		}	
	
 			)
  			.then(response => {
   			 	console.log(response);
   		    	
  			})
  			.catch(error => {
  			 			 console.log(error);
  			}); 

  	}



	render(){
		return(
			<>

				<Router>
					{
						this.state.DisplayWorkflowHome && 

						<div className={useStyles.root}>
				 	<Grid container spacing={3}>

				 		<Grid item xs={12}>
          					<h1> work flow</h1>
        				</Grid>

        				<Grid item xs={1}>

        				</Grid>
        				<Grid item xs={2} >
          						<Button color="primary" variant="contained" className={useStyles.button}
          						 onClick={this.openCreateFlowDialog}	
          						>
       								 Create Work Flow
      						</Button>
        				</Grid>

        				<Grid item xs={9}>

        				</Grid>

        				


        				<Grid item xs={1}>

        				</Grid>

        				<Grid item xs={10} className={useStyles.tableMargin}>
        						<MaterialTable
     								 title="Work flows"
     								 columns={this.state.workFlowListColumns}
      								 data={this.state.workFlowListData}
      							     editable={{
        										onRowAdd: newData =>
                                                	new Promise(resolve => {
                                               			 setTimeout(() => {
                                                			resolve();
                                               				const workFlowListData = [...this.state.workFlowListData];
                                               				workFlowListData.push(newData);
                                                			this.setState({ ...this.state, workFlowListData });
            											 }, 600);
          											}),

       								 			onRowUpdate: (newData, oldData) =>
          											new Promise(resolve => {
          												
            											setTimeout(() => {
              												resolve();
              												this.updateWorkFlow(newData)
              												const workFlowListData = [...this.state.workFlowListData];
              												workFlowListData[workFlowListData.indexOf(oldData)] = newData;
              												this.setState({ ...this.state, workFlowListData });
            											}, 600);
          											}),

       											 onRowDelete: oldData =>
          											new Promise(resolve => {
           												 setTimeout(() => {
             												 resolve();
             												 this.deleteWorkFlow(oldData)
              												 const workFlowListData = [...this.state.workFlowListData];
              												 workFlowListData.splice(workFlowListData.indexOf(oldData), 1);
              												 this.setState({ ...this.state, workFlowListData });
            											 }, 600);
          											}),
      										}}
    							/>
        				</Grid>


        				<Grid item xs={1}>

        				</Grid>



        			</Grid>	
				 </div>


					}
				 

				 <Dialog open={this.state.CreateFlowDialoge} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
        			 <DialogTitle id="form-dialog-title">Create new work flow</DialogTitle>
        				<DialogContent>
          					<DialogContentText>
            						Here you can create new work flow
          					</DialogContentText>
          					
 						<form className={useStyles.createFlowContainer} noValidate autoComplete="off"
 							onSubmit={this.handleSubmit}
 						>
          					<TextField
        							name="wokFlowName"
        							label="Name"
        							className={useStyles.textField}
        							placeholder="Enter work flow name"
        							margin="normal"
        							variant="outlined"
        							value={this.state.wokFlowName}
        							onChange={ this.handleChange }
        							required
      						/>
      						<br/>
      						 <TextField
        						name="WorkFlowDescription"
        						label="Discription"
        						multiline
        						rows="4"
        						placeholder="Enter work flow Discription"
        						className={useStyles.textField}
        						margin="normal"
        						variant="outlined"
        						value={this.state.WorkFlowDescription}
        						onChange={ this.handleChange }
        						required
     						 />

      					</form>	
        				</DialogContent>
        				
        				<DialogActions>
          					<Button onClick={this.handleDialogClose} color="primary">
            						Cancel
          					</Button >
          					<Link to="/manage-work-flow">
          					<Button type="submit" onClick={this.createWorkFlow} color="primary">
            					Create
         				    </Button>
         				    </Link>
     					</DialogActions>
     			 </Dialog>	

     			 			<Route exact path='/manage-work-flow' component={ManageWorkflow} />
					

				</Router>

   				 
			</>	
			)
	}
}

export default WorkFlow