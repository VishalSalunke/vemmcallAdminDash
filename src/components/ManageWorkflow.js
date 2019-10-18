import React , { Component } from 'react'
import Select from '@material-ui/core/Select';
import MaterialTable from 'material-table';
import axios from 'axios'
import SimpleReactValidator from 'simple-react-validator';

import Paper from '@material-ui/core/Paper';
import { Button , Grid , Link , Typography} from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemSecondaryAction
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditIcon from "@material-ui/icons/Edit";
import TuneIcon from "@material-ui/icons/Tune";
// import DeleteIcon from '@material-ui/icons/Delete';


import { makeStyles } from '@material-ui/core/styles';

import { Dialog , DialogTitle , DialogContent  , DialogActions , TextField ,
		InputLabel , FormControl , MenuItem , FormHelperText
	   }   from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },

  stageList : {
  	borderStyle: 'outset',
	padding: 5,
	marginTop: 5,
	marginLeft: 10,
  },
  createFlowContainer: {
    display: 'flex',	
   	justifyContent : 'space-around'
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
	},
	root: {
    padding: theme.spacing(3, 2),
	},
	closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
	// styles we need to apply on draggables
	borderStyle: 'outset',
	padding: 5,
	marginTop: 5,
	marginLeft: 10,
  ...draggableStyle,

  ...(isDragging && {
    background: "rgb(235,235,235)"
  })
});

const getListStyle = isDraggingOver => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});


export default class ManageWorkflow extends Component {

constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
    this.state = {
			
			stages: [],
      createStateDialog : false,
      exitActionColumns : [],
			workFlowListData : [],	
			consumerRequestColumns : [
					{ title : 'Date time' , field: 'result' },
					{ title : 'Name' , field: 'action_type' },
					{ title : 'Details' , field:'action_flow'},
					{ title : 'Funnel' , field:'action_flow'} 
			]	,
				exitActions : [ ],		
				exitActionActionFlowColumnDisable : 'always',	
				editStageDisableTemplate : false, 
        currentStage : {
						id : undefined,
						name : '',
						description : '',
						type : '',
						template : '',
						exit_actions : [],
						action_type: ''
				},
				jobTypes : {
					SendSmsJob : 'Send SMS',
					SendEmailJob : 'Send Email',
					SendWhatsappTemplateJob : 'Send whatsapp template',
					WaitJob : 'Wait job'
				},
				editStageBoxTitle : '' 	

    };
    this.onDragEnd = this.onDragEnd.bind(this);
	}
	
    onDragEnd(result) {
			// dropped outside the list
			
      if (!result.destination) {
      return;
      }

      const newStagesOrder = reorder(
        this.state.stages,
        result.source.index,
        result.destination.index
			);
			
			// this.state.stages.forEach((item,index)=>{

			// })
			let stage_order_hash = {}	
			newStagesOrder.forEach((item,index)=>{
					item.order = ((index + 1)*10)
					stage_order_hash[item.id] = item.order

			})

			this.updateStageOrders(stage_order_hash);
			console.log("*************** after drag   *******************")
			console.log(stage_order_hash)
			//calll update stage order here
    	this.setState({
      	stages : newStagesOrder
      });
		}
		updateStageOrders = async (stage_order_hash) =>{
			let id = this.state.currentStage.id;
			
			let res = await axios.put(`http://localhost:3000/react_api/v1/admin/stages/update_order`,
    												{
																crossDomain: true,
																stage_order_hash
    												},
    												{
 																headers : {
 																				'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
 																				'client' : '6fEfnZkXV5ewZzycrVyRJg',
 																				'uid' : 'vsalunke@quinstreet.com'
 																			}
 														}	
											 )

			let { data }  = res
  		console.log(data)
		}

		prepareActionColumns = () => {
				let exitColumns = [
          				{ title : 'Action Result' , field: 'result' },
									{ title : 'Action Type',field : 'action_type',
									editComponent: props => (
																	
										<select
											value={props.value}
											onChange={e => {
																	props.onChange(e.target.value)
																	e.target.value!== 'go_to_flow' ? this.state.exitActionActionFlowColumnDisable = 'never' : this.state.exitActionActionFlowColumnDisable = 'always'
																	//alert("hi")
															 }
											}								
										> 
										    <option> none </option>
										    <option value={'go_to_flow'}>Go to flow</option>
						 				    <option value={'success_exit'}>Success exit</option>
										    <option value={'failed_exit'}>Failed exit</option>
										</select>
									
									),
										lookup: { go_to_flow: 'Go to flow', success_exit: 'Success exit',failed_exit:'Failed exit' },
									},					
									{ title : 'Action Flow',field : 'action_flow',
									editable : this.state.exitActionActionFlowColumnDisable ,

													lookup: (() => {
																			let workFlows = this.listWorkflows()
																			let options = {}
																			workFlows.forEach((item)=>{
																				options[item.name] = item.name
																			})
																		return options
																})(),
									} 
				]
				this.setState({
					exitActionColumns : exitColumns
				});
		}
		
		listWorkflows = ()=>{
				return	this.state.workFlowListData
		}

    handleDialogClose = () => {
 				this.setState({
 					createStateDialog : false
 				})
		}
		
		makeCurrentStageEmplty = () => {
			let currentStage = {}
			
			this.setState({
						currentStage
			})
		}


    openCreateFlowDialog = () => {
				this.makeCurrentStageEmplty()
				this.prepareActionColumns()
 				this.setState({
					 createStateDialog : true,
					 editStageBoxTitle : 'Add new stage'
 				})
 		}	

 		handleSubmit = () => {
 			console.log(" form submitted ")
 		}


 	 handleChange = name => event => {
    		this.setState({
      						...this.state,
      						[name]: event.target.value,
    					 });
  	 };

		createStageAPI = () =>{
				 
			axios.post('http://localhost:3000/react_api/v1/admin/stages/create_stage',

			{	
				flow_id: this.state.flowID.toString(),
				name: this.state.currentStage.name,
				description: this.state.currentStage.description,
				class_name: this.state.currentStage.type,
				params:{ }.toString(),
				order: ((this.state.stages.length + 1)*10).toString()
			},{
				headers : {
				 'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
				 'client' : '6fEfnZkXV5ewZzycrVyRJg',
				 'uid' : 'vsalunke@quinstreet.com'
			 }
			})
			.then(response => {
				console.log(response);
				this.setState({
					stages : [...this.state.stages,response.data.stage]
				})
						
		})
		.catch(error => {
						console.log(error);
		});
		} 

		updateStageAPI = async () =>{
			let id = this.state.currentStage.id;
			
			let res = await axios.put(`http://localhost:3000/react_api/v1/admin/stages/${id}`,
    												{
																crossDomain: true,
 																name: this.state.currentStage.name,
																description: this.state.currentStage.description,
																class_name: this.state.currentStage.type,
																params : "{}"
    												},
    												{
 																headers : {
 																				'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
 																				'client' : '6fEfnZkXV5ewZzycrVyRJg',
 																				'uid' : 'vsalunke@quinstreet.com'
 																			}
 														}	
											 )

			let { data }  = res
  		console.log(data)			
		}


		  saveStage = () => {

				if (!this.validator.allValid()) {
					
					this.validator.showMessages();
					this.forceUpdate();
					return
				}
  	 				this.setState({
 								createStateDialog : false
 						});
				 
				 if(this.state.currentStage.id){
					 console.log("update stage");
					  this.updateStageAPI();
				 }else{
					 console.log("create stage")
					 this.createStageAPI();
				 }
				 
				 this.setState({
					stages : []
				 })
				this.fetchWorkFlowInfo(this.state.flowID);				 
		  }

		 fetchWorkFlowInfo = (flowId) => {
  	
  		   axios.get(`http://localhost:3000/react_api/v1/admin/flows/${flowId}`,
    		{
 				headers : {
 					'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
 					'client' : '6fEfnZkXV5ewZzycrVyRJg',
 					'uid' : 'vsalunke@quinstreet.com'
 				}
 			}	
	
 			)
  			.then(response => {
				
						console.log(response);
						this.setState({
							flowName : response.data.message.name,
							flowID : response.data.message.id,
							flowDescription : response.data.message.description, 								
						});	
						response.data.message.stages.forEach( stage =>{
									this.setState({
											stages : [...this.state.stages,stage]
									});
							});
   		    	
  			})
  			.catch(error => {
  			 			 console.log(error);
  			}); 

		}
		updateExitaction = (newData) =>{
			
			let id = newData.id
			axios.put(`http://localhost:3000/react_api/v1/admin/exit_actions/${id}`,

			{
			
				 result: newData.result,
				 action_type: newData.action_type,
				 action_flow: newData.action_flow
			
			},

			{
			 headers : {
				 'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
				 'client' : '6fEfnZkXV5ewZzycrVyRJg',
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

		deleteExitAction = (newData) =>{
			let id = newData.id
			axios.delete(`http://localhost:3000/react_api/v1/admin/exit_actions/${id}`,
			{
			 headers : {
				 'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
				 'client' : '6fEfnZkXV5ewZzycrVyRJg',
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

		addExitAction = (stage,newData) =>{
			console.log("****************************************")
			console.log(stage)
			console.log(newData)

			axios.post('http://localhost:3000/react_api/v1/admin/exit_actions/create_exit_action',

    		{
						stage_id: stage.id,
						result: newData.result,
						action_type: newData.action_type,
						action_flow: newData.action_flow
    		},

    		{
 				headers : {
 					'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
 					'client' : '6fEfnZkXV5ewZzycrVyRJg',
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

		disableEnableTemplateField = () =>{

		}	

  	 handleInputChange = ({ target }) => {
 				let currentStage = {...this.state.currentStage}
 				console.log("@@@@@@@@@@@@@@@@")
 				console.log(target)
 					currentStage[target.name] = target.value
 				this.setState({
      					currentStage
					});
					if(target.name === 'type'){						
						let editStageDisableTemplate
						target.value === "WaitJob" ? editStageDisableTemplate=true : editStageDisableTemplate=false
						this.setState({
							editStageDisableTemplate
						});
					}
					
		 }
		 
		 openUpdateStage = (stage) =>{
			this.prepareActionColumns()
			let id = stage.id
			axios.get(`http://localhost:3000/react_api/v1/admin/stages/${id}`,{
 				headers : {
 					'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
 					'client' : '6fEfnZkXV5ewZzycrVyRJg',
 					'uid' : 'vsalunke@quinstreet.com'

 				}
 			})
  			.then(response => {
   			 	console.log(response);
					 let stageDetails = response.data.message
					 let currentStage = {}

					 currentStage["id"] = stageDetails.id
					 currentStage["name"] = stageDetails.name
					 currentStage["description"] = stageDetails.description
					 currentStage["type"] = stageDetails.class_name
					 currentStage["template"] = stageDetails.template
					 currentStage["exit_actions"] = stageDetails.exit_actions
					 
					 this.setState({
							currentStage
					 }
					 )
					 this.setState({
							createStateDialog : true,
							exitActions : stageDetails.exit_actions,
							editStageBoxTitle : 'Update this stage'
					 })
					 	
  			})
  			.catch(error => {
  			 			 console.log(error);
				}); 
				


				
		 }	

		 fetchAllWorkFlow = () => {
			axios.get('http://localhost:3000/react_api/v1/admin/flows/flows',{
			headers : {
				'access-token' : 'qdCnY8YMAvR8KcFZjGC1oQ',
				'client' : '6fEfnZkXV5ewZzycrVyRJg',
				'uid' : 'vsalunke@quinstreet.com'

			},
			crossDomain: true
		})
		 .then(response => {
				 console.log(response);
					response.data.flows.forEach( item => {
							 this.setState({
						workFlowListData : [ ...this.state.workFlowListData , item]
					}) 
					})
		 })
		 .catch(error => {
						 console.log(error);
		 }); 

	}


  	 componentDidMount(){
				let flowId = this.props.history.location.pathname.match('([^/]+$)')[0]
				
			
				if(this.props.history.location.state){
					let newFlowData =  this.props.history.location.state.newFlowData 
					this.fetchWorkFlowInfo(newFlowData.id)
				}else if(flowId){
					this.fetchWorkFlowInfo(flowId)
				}
				this.fetchAllWorkFlow()
  	 }
  	
	render(){
		
		return(
			<>

				<h1> {this.state.flowName} </h1>
				<Paper className={useStyles.root}>
				<div style={{textAlign:"left" , margin:10}}>
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link color="inherit" href="/">
							Dashboard
          </Link>
          <Link color="inherit" href="/work-flows" >
            Workflows
          </Link>
          <Typography color="textPrimary">{this.state.flowName}</Typography>
        </Breadcrumbs>
						
					
						<h3>{this.state.flowDescription}</h3>
					 
				</div>
				</Paper>

				<Paper className={useStyles.root}>
					<Grid container spacing={3}>

					<Grid item xs={5}>
						<h2 style={{textAlign:"left" , margin:10}}> Stages </h2>
					</Grid>	

					<Grid item xs>
							<Button variant="outlined" color="primary" onClick={this.openCreateFlowDialog}
							>Add stage	 </Button>
					</Grid>


				</Grid>				
			<Grid item xs={3}>

			</Grid>	

			<Grid item xs={9}>

		<DragDropContext onDragEnd={this.onDragEnd}>
        	<Droppable droppableId="droppable">
          		{(provided, snapshot) => (
            		<RootRef rootRef={provided.innerRef}>
            		 	<List style={getListStyle(snapshot.isDraggingOver)} >
                			{this.state.stages.map((item, index) => (
                  					<Draggable key={item.id} draggableId={item.id} index={index}>
                    						{(provided, snapshot) => (
                   									<div > 	
                      									<ListItem
																					
                        									ContainerComponent="li"
                        									ContainerProps={{ ref: provided.innerRef }}
                        									{...provided.draggableProps}
                        									{...provided.dragHandleProps}
                        									style={getItemStyle(
                          											snapshot.isDragging,
                          											provided.draggableProps.style,
                          											useStyles.stageList
																						)}
																						
                      									>
                        									<ListItemIcon>
                          											<TuneIcon />
                        									</ListItemIcon>

                       		 								<ListItemText
                         			 								primary={item.name}
                         			 								secondary={item.description}
                        									/>

                        									<ListItemSecondaryAction>
                          											<IconButton onClick={() => this.openUpdateStage(item)}>
                            											<EditIcon  edge="start"/>
                          											</IconButton>
                        									</ListItemSecondaryAction>
																					
                      									</ListItem>
                      								</div>
                    						)}
                  					</Draggable>
                			))}
                			{provided.placeholder}
              			</List>
            		</RootRef>
          		)}
        	</Droppable>
      	</DragDropContext>
				


			</Grid>	
			</Paper>	

			<Paper className={useStyles.root}>																			
			<Grid item xs={12}>
				<h2 style={{textAlign:"left" , margin:10}}> Consumer requests </h2>
			</Grid>


			<Grid item xs={1}>

			</Grid>	

			<Grid item xs={1}>

			</Grid>	

			<Grid item xs={9}>
				{/* consumer request table */}
			</Grid>	

			<Grid item xs={2}>

			</Grid>	
		</Paper>										

			<Dialog open={this.state.createStateDialog} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
        			 
						<Grid item xs={8}>
								<DialogTitle id="form-dialog-title">{this.state.editStageBoxTitle}
									
								 </DialogTitle>						
						</Grid>
							 
        				<DialogContent>
          					{/* <DialogContentText>
            						Here you can add new stage to work flow
          					</DialogContentText> */}
          	
 						<form className={useStyles.createFlowContainer} noValidate autoComplete="off"
 							onSubmit={this.handleSubmit}
 						>	
          						<Grid container spacing={2}>
													<Grid item xs={6}>
														<div className="form-group">
															<TextField
        														id="stage_name"
        														label="Name"
        														className={useStyles.textField}
        														placeholder="Enter work flow name"
        														margin="normal"
        														variant="outlined"
        														name="name"
        														value={this.state.currentStage.name}
        														onChange={this.handleInputChange}
        														required
      												/>
															{this.validator.message('name',this.state.currentStage.name, 'required')}
															</div>
													</Grid>	
													
													<Grid item xs={6}>
													<div className="form-group">
															<FormControl >
        												<InputLabel htmlFor="stage-type">Type</InputLabel>
        														<Select
          															native          					
          															name="type" 
          															value={this.state.currentStage.type} 
          															onChange={this.handleInputChange}          									
        														>
         									 							<option value="" />
         									 							<option value={'SendSmsJob'}>Send SMS</option>
         									 							<option value={'SendEmailJob'}>Send Email</option>
          								 							<option value={'SendWhatsappTemplateJob'}>Send whatsapp template</option>
          								 							<option value={'WaitJob'}>Wait job</option>
       															</Select>
     						 							</FormControl>
																{this.validator.message('type',this.state.currentStage.name, 'required')}		
																</div>
													</Grid>

													<Grid item xs={12}>
													<div>	
															<TextField
        														id="stage_discription"
        														label="Description"
        														
        														placeholder="Enter work flow Discription"
        														fullWidth
        														margin="normal"
        														variant="outlined"
        														name="description"
        														value={this.state.currentStage.description}
        														onChange={this.handleInputChange}
        														required
     						 							/>	
																{this.validator.message('description',this.state.currentStage.name, 'required')}
														</div>		
													</Grid>
														

													<Grid item xs={6}>
															<TextField
        															id="stage_template"
        															label="Template"
        															multiline
        															rows="4"
        															placeholder="Enter template"
        															className={useStyles.textField}
        															margin="normal"
        															variant="outlined"
        															name="template"
        															value={this.state.currentStage.template}
        															onChange={this.handleInputChange}
																			required
																			disabled={ this.state.editStageDisableTemplate? true : false}
     						 							/>
													</Grid>
											</Grid>
											<DialogActions>
														<Button variant="outlined"  onClick={this.handleDialogClose} color="secondary"										 						
										 				>
            									Delete
         				    				</Button>
          									<Button variant="outlined" onClick={this.handleDialogClose} color="default">
            									Cancel
          									</Button >          		
          									<Button variant="outlined"  onClick={this.saveStage} color="primary">
            									Save
         				    				</Button>         				           				  
     									</DialogActions>
											 </form>	
										
										
     					<MaterialTable
                              title="Exit actions"
                              columns={this.state.exitActionColumns}
															data={this.state.exitActions}
															options={{
																actionsColumnIndex: -1,
																search: false,
																paging: false
																}}
                              editable={{
                                onRowAdd: newData =>
                                  new Promise(resolve => {
                                    setTimeout(() => {
																			resolve();
																			
																			if(!newData.result || !newData.action_type){
																				alert("Please enter exit action details")
																					return
																			}
																			
newData.action_type ==='success_exit' ? newData["action_flow"] = 'success' : newData.action_type == 'failed_exit' ? newData["action_flow"] = 'failed' : console.log("Done")
																			 
																			
																			
                                      const exitActions = [...this.state.exitActions];
                                      exitActions.push(newData);
																			this.setState({ ...this.state, exitActions });
																			this.addExitAction(this.state.currentStage,newData)
                                    }, 600);
                                  }),
                              onRowUpdate: (newData, oldData) =>
                                new Promise(resolve => {
                                  setTimeout(() => {
																		resolve();
																		if(!newData.result || !newData.action_type){
																			alert("Please enter exit action details")
																				return
																		}
																		newData.action_type ==='success_exit' ? newData["action_flow"] = 'success' : newData.action_type == 'failed_exit' ? newData["action_flow"] = 'failed' : console.log("Done")																		
                                    const exitActions = [...this.state.exitActions];
             					    exitActions[exitActions.indexOf(oldData)] = newData;
																		this.setState({ ...this.state, exitActions });
																		this.updateExitaction(newData)
                                  }, 600);
                                }),
                              onRowDelete: oldData =>
                                new Promise(resolve => {
                                  setTimeout(() => {
                                    resolve();
                                    const exitActions = [...this.state.exitActions];
                                    exitActions.splice(exitActions.indexOf(oldData), 1);
																		this.setState({ ...this.state, exitActions });
																		this.deleteExitAction(oldData)
                                  }, 600);
                                }),
                            }}
                        />	 
        				</DialogContent>        				        			
     			 </Dialog>	

		</>	
      )
	}

}


