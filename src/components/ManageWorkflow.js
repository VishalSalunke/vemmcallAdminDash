import React , { Component } from 'react'
import Select from '@material-ui/core/Select';
import MaterialTable from 'material-table';
import axios from 'axios'

import Paper from '@material-ui/core/Paper';
import { Button , Grid} from '@material-ui/core';


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
import EmailIcon from "@material-ui/icons/Inbox";
import EditIcon from "@material-ui/icons/Edit";


import { makeStyles } from '@material-ui/core/styles';

import { Table , TableBody , TableCell , TableHead  , TableRow ,
		Dialog , DialogTitle , DialogContent , DialogContentText , DialogActions , TextField ,
		InputLabel , FormControl 
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
  }
}));


const getStages = () => {
	let Stages = [
					{ 
					  id:501, flowID : 1 , name : 'Send hello email' , description: 'very first email' , 
					  class_name : 'sendSmsJob' , order : 1 , template : ' Thank you for your enquiry',
					  exit_actions : [{ status : 'invalid email', go_to_flow : 'invalid lead flow' }]
				    },
				    { 
					  id:502, flowID : 1 , name : 'Send whatsapp msg' , description: 'enggage user on whatsapp' , 
					  class_name : 'sendWhatsappJob' , order : 2 , template : ' welcome to xyz insurance company',
					  exit_actions : [{ status : 'invalid user', go_to_flow : 'invalid user flow' }]
						},
						{ 
							id:503, flowID : 1 , name : 'call user' , description: 'enggage user on whatsapp' , 
							class_name : 'sendWhatsappJob' , order : 3 , template : ' welcome to xyz insurance company',
							exit_actions : [{ status : 'invalid user', go_to_flow : 'invalid user flow' }]
						},
						{ 
							id:504, flowID : 1 , name : 'wait job' , description: 'enggage user on whatsapp' , 
							class_name : 'sendWhatsappJob' , order : 4 , template : ' welcome to xyz insurance company',
							exit_actions : [{ status : 'invalid user', go_to_flow : 'invalid user flow' }]
						}	
	]

	return Stages
}
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
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
    this.state = {
			items: getStages(),
			stages: [],
      createStateDialog : false,
      exitActionColumns : [
          { title : 'Status' , field: 'exitActionStatus' },
          { title : 'Go to flow' , field: 'goToFlow' }

        ],
        exitActions : [
          { exitActionStatus : 'Invalid email' , goToFlow: 'Invalid lead flow'},
          { exitActionStatus : 'Mail box full' , goToFlow: 'Try later flow ' }

        ],
        currentStage : {
        			id : undefined,
        			name : '',
        			description : '',
        			type : '',
        			template : ''
        }	

    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  createData = (dateTime, name, details, funnel) => {
 	 return { dateTime, name, details, funnel };	
 }

  rows = [
  this.createData('10/11/2019', 'Simon B', 'Ford 500', 'Lost'),
  this.createData('19/08/2019', 'Lucas M', 'Audi A5', 'Proposal'),
  this.createData('11/10/2019', 'Danniel P', 'BMW 5', 'Lost'),
  this.createData('18/11/2019', 'Abhijjt N', 'Honda jazz', 'Proposal'),
  this.createData('12/07/2019', 'Vishal s', 'Jeep sports', 'Lost'),
	];


 	
    onDragEnd(result) {
			// dropped outside the list
			debugger
      if (!result.destination) {
      return;
      }

      const newStagesOrder = reorder(
        this.state.stages,
        result.source.index,
        result.destination.index
      );

			newStagesOrder.forEach((item,index)=>{
					item.order = index + 1
			})
			//calll update stage order here
    	this.setState({
      	stages : newStagesOrder
      });
  	}

    handleDialogClose = () => {
 				this.setState({
 					createStateDialog : false
 				})
 		}

    openCreateFlowDialog = () => {
 				this.setState({
 					createStateDialog : true
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

  	 saveStage = () => {
  	 		this.setState({
 					createStateDialog : false
 				})

  	 		axios.post('http://localhost:3000/react_api/v1/admin/stages/create_stage',

    		{	
    			flow_id: this.state.flowID.toString(),
					name: this.state.currentStage.name,
					description: this.state.currentStage.description,
					class_name: this.state.currentStage.type,
					params:{ }.toString(),
					order: (this.state.stages.length + 1).toString()
    		},{
    			headers : {
 					'access-token' : 'M1fCUjQHAGMO1x_CqV1Kuw',
 					'client' : 'CPCFC0DUyVOgbpvRV91hLQ',
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
		 fetchWorkFlowInfo = (flowId) => {
  		
  		   axios.get(`http://localhost:3000/react_api/v1/admin/flows/${flowId}`,
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
							flowName : response.data.message.name,
							flowID : response.data.message.id,
							flowDescription : response.data.message.description, 								
			})	
			response.data.message.stages.forEach( stage =>{
				this.setState({
					stages : [...this.state.stages,stage]
				})
			})
   		    	
  			})
  			.catch(error => {
  			 			 console.log(error);
  			}); 

  	}

  	 handleInputChange = ({ target }) => {
 				let currentStage = {...this.state.currentStage}
 				console.log("@@@@@@@@@@@@@@@@")
 				console.log(target)
 					currentStage[target.name] = target.value
 				this.setState({
      					currentStage
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
  	 }
  	
	render(){
		
		return(
			<>

				<h1> Manage work flow </h1>
				<Paper className={useStyles.root}>
				<div style={{textAlign:"left" , margin:10}}>
					
						<h2>{this.state.flowName}</h2>
					
						<h3>{this.state.flowDescription}</h3>
					 
				</div>
				</Paper>

				<Paper className={useStyles.root}>
					<Grid container spacing={3}>

					<Grid item xs>
						<h3 style={{textAlign:"left" , margin:10}}> Stages </h3>
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
                          											<EmailIcon />
                        									</ListItemIcon>

                       		 								<ListItemText
                         			 								primary={item.name}
                         			 								secondary={item.description}
                        									/>

                        									<ListItemSecondaryAction>
                          											<IconButton onClick={alert("hello")}>
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
				<h3 style={{textAlign:"left" , margin:10}}> Consumer requests </h3>
			</Grid>


			<Grid item xs={1}>

			</Grid>	

			<Grid item xs={1}>

			</Grid>	

			<Grid item xs={9}>
				<Table className={useStyles.table} width="auto"> 
          			<TableHead>
            				<TableRow>
              						<TableCell>Date time</TableCell>
              						<TableCell align="right">Name</TableCell>
              						<TableCell align="right">Details</TableCell>
              						<TableCell align="right">Funnel</TableCell>
           					 </TableRow>
         			</TableHead>
          			<TableBody>
            					{this.rows.map(row => (
              							<TableRow key={row.dateTime}>
                							<TableCell component="th" scope="row">
                  								{row.dateTime}
                							</TableCell>
                							<TableCell align="right">{row.name}</TableCell>
                							<TableCell align="right">{row.details}</TableCell>
                							<TableCell align="right">{row.funnel}</TableCell>
              							</TableRow>
            					))}
          			</TableBody>
        		</Table>
			</Grid>	

			<Grid item xs={2}>

			</Grid>	
		</Paper>										

			<Dialog open={this.state.createStateDialog} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
        			 <DialogTitle id="form-dialog-title">Add new stage </DialogTitle>
        				<DialogContent>
          					<DialogContentText>
            						Here you can add new stage to work flow
          					</DialogContentText>
          					
 						<form className={useStyles.createFlowContainer} noValidate autoComplete="off"
 							onSubmit={this.handleSubmit}
 						>	
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
      						
      						 <TextField
        						id="stage_discription"
        						label="Discription"
        						multiline
        						rows="4"
        						placeholder="Enter work flow Discription"
        						className={useStyles.textField}
        						margin="normal"
        						variant="outlined"
        						name="description"
        						value={this.state.currentStage.description}
        						onChange={this.handleInputChange}
        						required
     						 />
     						 
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
         									 <option value={'SendemailJob'}>Send Email</option>
          									<option value={'SendWhatsappTemplateJob'}>Send whatsapp template</option>
          									<option value={'WaitJob'}>Wait job</option>
       									</Select>
     						 </FormControl>

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
     						 />

     					<MaterialTable
                              title="Exit actions"
                              columns={this.state.exitActionColumns}
                              data={this.state.exitActions}
                              editable={{
                                onRowAdd: newData =>
                                  new Promise(resolve => {
                                    setTimeout(() => {
                                      resolve();
                                      const exitActions = [...this.state.exitActions];
                                      exitActions.push(newData);
                                      this.setState({ ...this.state, exitActions });
                                    }, 600);
                                  }),
                              onRowUpdate: (newData, oldData) =>
                                new Promise(resolve => {
                                  setTimeout(() => {
                                    resolve();
                                    const exitActions = [...this.state.exitActions];
             					    exitActions[exitActions.indexOf(oldData)] = newData;
                                    this.setState({ ...this.state, exitActions });
                                  }, 600);
                                }),
                              onRowDelete: oldData =>
                                new Promise(resolve => {
                                  setTimeout(() => {
                                    resolve();
                                    const exitActions = [...this.state.exitActions];
                                    exitActions.splice(exitActions.indexOf(oldData), 1);
                                    this.setState({ ...this.state, exitActions });
                                  }, 600);
                                }),
                            }}
                        />	 

      					</form>	
        				</DialogContent>
        				
        				<DialogActions>
          					<Button onClick={this.handleDialogClose} color="primary">
            						Cancel
          					</Button >
          					
          					<Button type="submit" onClick={this.saveStage} color="primary">
            					Save
         				    </Button>

         				    <Button type="submit" onClick={this.handleDialogClose} color="primary">
            					Delete
         				    </Button>
         				  
     					</DialogActions>
     			 </Dialog>	


		</>	
      )
	}

}


