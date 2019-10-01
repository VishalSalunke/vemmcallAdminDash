import React , { Component } from 'react'
import { BrowserRouter as Router , Link , Route } from 'react-router-dom'
import  ManageWorkflow  from './ManageWorkflow'


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
	
			columns: [
     					 { title: 'Name', field: 'name' },
      						{ title: 'Discription', field: 'discription' },
     											
    				],

    		data: [
     				 { name: 'Invalid number follow up flow', discription: ' This flow gets called  when the initial call failed because of invalid number'
     				 },

     				 { name: 'User not available',discription: 'User didint recieved call'},
    			  ],
    		CreateFlowDialoge : false,
    		DisplayWorkflowHome : true	  		
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

 		handleSubmit = () => {
 			console.log(" form submitted ")
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
     								 columns={this.state.columns}
      								 data={this.state.data}
      							     editable={{
        										onRowAdd: newData =>
                                                	new Promise(resolve => {
                                               			 setTimeout(() => {
                                                			resolve();
                                               				const data = [...this.state.data];
                                               				data.push(newData);
                                                			this.setState({ ...this.state, data });
            											 }, 600);
          											}),

       								 			onRowUpdate: (newData, oldData) =>
          											new Promise(resolve => {
            											setTimeout(() => {
              												resolve();
              												const data = [...this.state.data];
              												data[data.indexOf(oldData)] = newData;
              												this.setState({ ...this.state, data });
            											}, 600);
          											}),

       											 onRowDelete: oldData =>
          											new Promise(resolve => {
           												 setTimeout(() => {
             												 resolve();
              												 const data = [...this.state.data];
              												 data.splice(data.indexOf(oldData), 1);
              												 this.setState({ ...this.state, data });
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
        							id="wokFlow-name"
        							label="Name"
        							className={useStyles.textField}
        							placeholder="Enter work flow name"
        							margin="normal"
        							variant="outlined"
        							required
      						/>
      						<br/>
      						 <TextField
        						id="WorkFlow-discription"
        						label="Discription"
        						multiline
        						rows="4"
        						placeholder="Enter work flow Discription"
        						className={useStyles.textField}
        						margin="normal"
        						variant="outlined"
        						required
     						 />

      					</form>	
        				</DialogContent>
        				
        				<DialogActions>
          					<Button onClick={this.handleDialogClose} color="primary">
            						Cancel
          					</Button >
          					<Link to="/manage-work-flow">
          					<Button type="submit" onClick={this.handleCreateFlow} color="primary">
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