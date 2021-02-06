import React from 'react';

import { Box, makeStyles } from "@material-ui/core";

import Footer from "./Footer/Footer";
import HomeLayout from '../Home/HomeLayout'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    header: {
        height: 150,
        border: '1px solid green',
    },
    content: {
        height: 500,
        border: '1px solid yellow',
    },
}));

const MainLayout = () => {
    const classes = useStyles();

    return <Box className={classes.root}>
        <Box className={classes.header}>Header</Box>
        <Box className={classes.content}><HomeLayout></HomeLayout></Box>
        <Footer />
    </Box>;
};

export default MainLayout;