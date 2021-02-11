import React, { useState } from 'react';
import { useRouter } from 'next/router';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { Box, BottomNavigation, BottomNavigationAction } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2">
      {' Все права защищены ©  forte'}
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    height:'20vh',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
  bottomNav: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    width:'5vh',
    marginLeft:'auto',
    marginRight:'auto'
  }
}));

export default function Footer() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const router = useRouter();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Copyright />
          <Box>
            <BottomNavigation className={classes.bottomNav}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    switch (newValue) {
                        case 0:
                            router.push('https://www.instagram.com');
                            break;
                        case 1:
                            router.push('https://www.facebook.com');
                            break;
                        case 2:
                            router.push('https://youtube.com');
                            break;
                    }
                }}
                showLabels
            >
                <BottomNavigationAction className={classes.bottomNav} label="Instagram" icon={<InstagramIcon />} />
                <BottomNavigationAction className={classes.bottomNav} label="Facebook" icon={<FacebookIcon />} />
                <BottomNavigationAction className={classes.bottomNav} label="YouTube" icon={<YouTubeIcon />} />
            </BottomNavigation>
          </Box>
        </Container>
      </footer>
    </div>
  );
}