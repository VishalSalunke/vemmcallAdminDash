import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';



import { BrowserRouter as Router , Link , Route , Switch } from 'react-router-dom' 

import WorkFlow from './WorkFlow'
import  ManageWorkflow  from './ManageWorkflow'
import  Home  from './Home'
import Experiment from './Experiment'
import DisplayExperiment from './DisplayExperiment'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


   

 function Dashboard() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

   return (
      <div className={classes.root}>
        <Router>
          <CssBaseline />
          <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
          >
          <Toolbar>
              <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      className={clsx(classes.menuButton, open && classes.hide)}
               >
               <MenuIcon />
              </IconButton>
                    <Typography variant="h6" noWrap>
                        VEMMCALL
                    </Typography>
              </Toolbar>
          </AppBar>
      <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
              paper: classes.drawerPaper,
          }}
      >
        <div className={ classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon />  :   <ChevronRightIcon /> }
          </IconButton>
        </div>
        <Divider />
          <List>
                 <Link to='/'> 
                    <ListItem button onClick={handleDrawerClose}>
                        
                          <ListItemIcon>{ <HomeIcon />}</ListItemIcon>
                          <ListItemText primary="Home"/>
                                              
                    </ListItem>
                 </Link> 

                 <Link to='/work-flows'>
                      <ListItem button onClick={handleDrawerClose}>
                          <ListItemIcon>{ <AccountTreeIcon />}</ListItemIcon>
                          <ListItemText primary="Work Flow"/>
                      </ListItem>    
                 </Link> 

                 <Link to='/experiments'> 
                    <ListItem button onClick={handleDrawerClose}>
                        
                          <ListItemIcon>{ <OutdoorGrillIcon />}</ListItemIcon>
                          <ListItemText primary="Experiment"/>
                                              
                    </ListItem>
                 </Link>
               
               
                 

          </List>
      </Drawer>
      <main
      className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
      <div className={classes.drawerHeader} />
      
            <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/work-flows' component={WorkFlow} />
            <Route exact  path='/work-flows/:workflowID' component={ManageWorkflow} />
            <Route exact path='/experiments' component={Experiment} />
            <Route exact  path='/experiments/:experimentId' component={DisplayExperiment} />
          </Switch>
          
      

        
      </main>
          </Router>
    </div>


  )
}

export default Dashboard