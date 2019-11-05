import React, {Component} from 'react'
import MaterialTable from 'material-table';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios'

import { Button , Grid , Dialog , DialogTitle , DialogContent  , DialogActions ,
		 TextField, Select, InputLabel} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

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
	},
	 
  }));

export default class Experiment extends Component{
	constructor(props){
		super(props)
		this.validator = new SimpleReactValidator();
		this.state = {
			experimetsListColumns : [
										{ title: 'Name', field: 'name' },
										{ title: 'Description', field: 'description' },	
										// { title: 'Flow A', field: 'flowA' },
										// { title: 'Flow B', field: 'flowB' },
										{title: 'Status',field: 'state'}						        											
									  ],
			experimetsListData : [{
									id : 1,	
									name:'Test invalid number flow',
									description:'A/B between two invalid number flows',
									flowA: 'Invalid call1',
									flowB: 'Invalid call 2',
									state: 'Active'
								  },
								  {
									id : 2,  
									name:'Test invalid sms flow',
									description:'A/B between two invalid sms flows',
									flowA: 'Invalid message 1',
									flowB: 'Invalid sms 2',
									state: 'Inactive'
								  }
								 ],
			CreateExperimentDialoge : false,
			flowsDropDownOptionsA : [],
			flowsDropDownOptionsB : [],
			flowsDropDownOptionsAll : [],
			flowsData: {}, 
			currentExperience : {
				name: '',
				description : '',
				flowA : '',
				flowB : '',
				status: ''
			},
			ListOfExperiments : []					 	
									  		
		}
	}	

	componentDidMount(){
		this.fetchWorkFlowNAmes()
		this.getExperiments()
	}


	fetchWorkFlowNAmes = () => {
		axios.get('http://localhost:3000/react_api/v1/admin/flows/flows',{
		headers : {
			'access-token' : 'SPxukvxCwGULVdfyDE2daQ',
				 'client' : 'SK9dW5VauJg2XH2jBTFp1w',
				 'uid' : 'vsalunke@quinstreet.com'

		},
		crossDomain: true
	})
	 .then(response => {
		   console.log(response);
		   let flowsData = {}
		  response.data.flows.forEach( item => {
				  
				  flowsData[item.name] = item.id	
				 
				   this.setState({
					flowsDropDownOptionsA : [ ...this.state.flowsDropDownOptionsA , item.name],
					flowsDropDownOptionsB : [ ...this.state.flowsDropDownOptionsB , item.name],
					flowsDropDownOptionsAll : [...this.state.flowsDropDownOptionsAll , item.name]
					
				}) 
		  })
		  this.setState({
			flowsData
		  })
	 })
	 .catch(error => {
				   console.log(error);
	 }); 

}



	handleDialogClose = () => {
		//let flowsDropDownOptionsAll = this.state.flowsDropDownOptionsAll
		this.setState({
			CreateExperimentDialoge : false,
			//flowsDropDownOptionsA : flowsDropDownOptionsAll,
			//flowsDropDownOptionsB : flowsDropDownOptionsAll
		})
	}

	openCreateExperimentDialog = () => {
			this.setState({
				CreateExperimentDialoge : true
			})
	}	
	handleChange = ({ target }) => {
		let currentExperience = {...this.state.currentExperience}
		currentExperience[target.name]= target.value
		this.setState({
			currentExperience
	   });
	}

	getExperiments = async()=>{
		let res = await axios.get(`http://localhost:3000/react_api/v1/admin/experiments/experiments`,
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
		//debugger
		data.experiments.forEach(experiment =>{
			this.setState({
				ListOfExperiments : [...this.state.ListOfExperiments,experiment]
			})
		})
		// let ListOfExperiments  = data.experiments
		// this.setState({
		// 	ListOfExperiments : [...this.state.ListOfExperiments,ListOfExperiments]
		// })
	}

	handleDropDownChange = ({target}) =>{
			
			//let flowsDropDownOptions = new Array(this.state.flowsDropDownOptionsAll)
			let flowsDropDownOptionsA = [...this.state.flowsDropDownOptionsAll]
			let flowsDropDownOptionsB = [...this.state.flowsDropDownOptionsAll]
			
			let currentExperience = {...this.state.currentExperience}
			


			currentExperience[target.name]= target.value

			if(target.value==='None'){
				if(target.name==='flowA'){
					this.setState({
						...this.state,
						currentExperience,
						flowsDropDownOptionsB						
					})
				}else{
					this.setState({
						...this.state,
						currentExperience,
						flowsDropDownOptionsA						
					})
				}
				return
			}


			target.name==='flowA' ? 
			
			flowsDropDownOptionsB.forEach((item,index)=>{
				if(item === target.value){
					flowsDropDownOptionsB.splice(index,1)
					
					this.setState({
						// currentExperience,
						...this.state,
						flowsDropDownOptionsB,
						currentExperience
					})
				}
			})			
			:
			flowsDropDownOptionsA.forEach((item,index)=>{
				if(item === target.value){
					flowsDropDownOptionsA.splice(index,1)
					this.setState({
						currentExperience,
						flowsDropDownOptionsA : flowsDropDownOptionsA
					})
				}
			})
			
	}

	createExperiment = () =>{
		if (!this.validator.allValid()) {
					
			this.validator.showMessages();
			this.forceUpdate();
			return
		}
		//alert("experiment created ")
		axios.post('http://localhost:3000/react_api/v1/admin/experiments/create_experiment',

			{	
				flow_1_id: this.state.flowsData[this.state.currentExperience.flowA].toString(),
				flow_2_id: this.state.flowsData[this.state.currentExperience.flowB].toString(),
				name: this.state.currentExperience.name,
				description: this.state.currentExperience.description,
				state: this.state.currentExperience.status,				
			},{
				headers : {
				 'access-token' : 'SPxukvxCwGULVdfyDE2daQ',
				 'client' : 'SK9dW5VauJg2XH2jBTFp1w',
				 'uid' : 'vsalunke@quinstreet.com'
			 }
			})
			.then(response => {
				console.log(response);
				this.setState({
					ListOfExperiments : [...this.state.ListOfExperiments,response.data.experiment],
					CreateExperimentDialoge : false
				})
				//this.getExperiments()
				
						
		})
		.catch(error => {
						console.log(error);
		});
	}


	render(){
		return (
			<>
			   <div className={useStyles.root}>
			   		<Grid container spacing={1}>
							<Grid item xs={12}> 
									<h1> Experiments </h1>	
							</Grid>
							<Grid item xs={10}>

        					</Grid>
							<Grid item xs={2}> 
								<Button color="primary" variant="contained" 
										onClick={this.openCreateExperimentDialog}
								>
       								 Create Experiment
      				    		</Button>
							</Grid>
		
				<Grid  item xs={12} className={useStyles.tableMargin}>

				<MaterialTable
     								 title="Experiments"
     								 columns={this.state.experimetsListColumns}
									 data={this.state.ListOfExperiments}
									 onRowClick={(event, rowData) => this.props.history.push(`/experiments/${rowData.id}`,{ newExperiment : rowData})}
								
									options={{
												  actionsColumnIndex: -1,
												  addRow: false
        									}}	        									  
      							     editable={{
        										onAdd: 'never',

       								 			onRowUpdate: (newData, oldData) =>
          											new Promise(resolve => {
          												
            											setTimeout(() => {
              												resolve();
              												//this.updateWorkFlow(newData)
              												const ListOfExperiments = [...this.state.ListOfExperiments];
              												ListOfExperiments[ListOfExperiments.indexOf(oldData)] = newData;
              												this.setState({ ...this.state, ListOfExperiments });
            											}, 600);
          											}),

       											 onRowDelete: oldData =>
          											new Promise(resolve => {
           												 setTimeout(() => {
             												 resolve();
             												 this.deleteWorkFlow(oldData)
              												 const ListOfExperiments = [...this.state.ListOfExperiments];
              												 ListOfExperiments.splice(ListOfExperiments.indexOf(oldData), 1);
              												 this.setState({ ...this.state, ListOfExperiments });
            											 }, 600);
          											}),
      										}}
    							/>

				</Grid>
			
			
				</Grid>


				<Dialog open={this.state.CreateExperimentDialoge} onClose={this.handleDialogClose}
						 aria-labelledby="form-dialog-title" fullWidth={true}>
        			 
					 
					 
					 <Grid item xs={12}>
					 <DialogTitle id="form-dialog-title">Create new experiment</DialogTitle>					  	
					 </Grid>
					 
				<DialogContent>		
					 <Grid container >

					 <Grid item xs={6}>
					 <div>
          					<TextField
        							name="name"
        							label="Name"
        							className={useStyles.textField}
        							placeholder="Enter Experiment name"
        							margin="normal"
        							variant="outlined"
        							value={this.state.currentExperience.name}
        							onChange={ this.handleChange }
        							required
      						/>
							  {this.validator.message('experimentName',this.state.currentExperience.name, 'required')}
						 </div>				  
					 
					 </Grid>
							<Grid item xs={6}></Grid>	 

							<Grid item xs={12}>
					 <div>
      						 <TextField
        						name="description"
        						label="Description"        						
        						fullWidth
        						placeholder="Enter work flow Description"
        						className={useStyles.textField}
        						margin="normal"
        						variant="outlined"
        						value={this.state.currentExperience.description}
        						onChange={ this.handleChange }
        						required
     						 />
								{this.validator.message('experimentDescription',this.state.currentExperience.description, 'required')}
							</div>  				  	
					 
					</Grid> 
 

						<Grid item xs={4}>
						<div>
							<InputLabel htmlFor="flow-A-simple">Flow A</InputLabel>	
							  <Select
									native
									name='flowA'  
          							value={this.state.currentExperience.flowA}
          							onChange={this.handleDropDownChange}
          							inputProps={{
          		  						name: 'flowA',
            							id: 'flow-A-simple',
          							}}
        					  >  
          						  <option value="None">None</option>
																		
										{this.state.flowsDropDownOptionsA.map((item) =>{
											
												return <option key={item} value={item}>{item}</option>
																							
											})
										  }

        					</Select>
							{this.validator.message('flow A',this.state.currentExperience.flowA, 'required')}
							</div>			  
						
						</Grid>		
						{/* <Grid item xs={1}></Grid> */}

						<Grid item xs={4}>
						<div>
							<InputLabel htmlFor="flow-B-simple">Flow B</InputLabel>	
							  <Select
									native
									name='flowB'  
          							value={this.state.currentExperience.flowB}
          							onChange={this.handleDropDownChange}
          							inputProps={{
          		  						name: 'flowB',
            							id: 'flow-B-simple',
          							}}
        					  >  
          						  <option value="None">None</option>
									{this.state.flowsDropDownOptionsB.map((item) =>{
											
												return <option key={item} value={item}>{item}</option>
																						
											})
										  }

        					</Select>
							{this.validator.message('flowB',this.state.currentExperience.flowB, 'required')}
							</div>			  
						
						</Grid>
						{/* <Grid item xs={1}></Grid>		 */}

						<Grid item xs={4}>
						<div>
							<InputLabel htmlFor="status-simple">Status</InputLabel>	
							  <Select
									native
									name='status'  
          							value={this.state.currentExperience.status}
          							onChange={this.handleChange}
          							inputProps={{
          		  						name: 'status',
            							id: 'status-simple',
          							}}
        					  >  
          						  <option value="" />
          						  <option value={'Active'}>Active</option>
          						  <option value={'Inactive'}>Inactive</option>
          						  
        					</Select>
							{this.validator.message('status',this.state.currentExperience.status, 'required')}
							</div>			  
						
						</Grid>		 

					</Grid>	
					
        				</DialogContent>
        				
        				<DialogActions>
          					<Button onClick={this.handleDialogClose} color="primary">
            						Cancel
          					</Button >


          					
          					<Button type="submit" color="primary" onClick={this.createExperiment} >
            					Create
         				    </Button>
         				    	
         				   
     					</DialogActions>
     			 </Dialog>
				

			   </div>	
				
			</>					
		)
	}
}