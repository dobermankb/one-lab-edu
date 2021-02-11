import React from 'react';

import { Box, makeStyles } from "@material-ui/core";

import Footer from "./Footer/Footer";
import BannerLayout from '../Home/BannerLayout'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    header: {
        height: 150,
    },
    content: {
        height: 500,
    },
}));

const MainLayout = () => {
    const classes = useStyles();

    return <Box className={classes.root}>
        <Box className={classes.header}></Box>
        <Box className={classes.content}><BannerLayout></BannerLayout></Box>
        <Footer />
    </Box>;
};

export default MainLayout;