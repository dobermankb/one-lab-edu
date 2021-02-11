import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

 
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: "#f8f8f8"}}> 
        <Toolbar>       
          <Typography variant="h6" className={classes.title} style={{color: "#000"}}>
            Logo
          </Typography>
          <Button color="inherit" style={{color: "#000"}} className="header__button">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
