import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

import db from './firebase.config';


const useStyles = makeStyles((theme) => ({
  root: {
  },
  image_url: {
    width:'100%',
    height:'50vh',
    position:'relative'
  },
  rightRow: {
      color:'white',
      float:'right'

  },
  leftRow: {
      color:'white',
      float:'left'
  },
  container: {
      position:'absolute',
      marginTop:'-26vh'
  },
  carousel: {
      width:'99.82vw',
      position:'absolute',
  },
  title: {
      marginTop:'-50vh',
      marginLeft:'15%',
      position:'absolute',
      fontSize:'35px',
      color:'white',
      fontFamily:'Verdana',
      fontWeight:'bold'
  },
  subtitle: {
    marginTop:'-39vh',
    marginLeft:'15%',
    position:'absolute',
    fontSize:'20px',
    color:'white',
    fontFamily:'Verdana'
  },
  buttonContainer: {
    position:'absolute',
    width:'160px',
    height:'45px',
    marginTop:'-28vh',
    marginLeft:'15%',
  },
  button: {
    width:'160px',
    display:'block',
    height:'45px',
    borderRadius:'5px',
    borderColor:'black',
    color:'purple',
    backgroundColor:'white',
    textAlign:'center',
    fontWeight:'bold',
    padding:'13px',
    fontFamily:'Verdana',
    textDecoration:'none'
  }
}));

export default function Carousel(){
  const classes = useStyles();

  const [ slides, setSlides ] = useState([
    {
        image_url: "",
        title: "",
        description: "",
        link:"",
        button_text:"",
    }
  ]);

  useEffect(() => {
    fetchData();
  },[])

  const fetchData = async() => {
    const response = db.collection('banners');
    let newData = []
    let data = await response.get()
    .then(item => {
      newData = item.docs.map(doc => doc.data())
      setSlides(newData)
    }) 
  }

  let [ currentPosition, setCurrentPosition ] = useState(0);
  let currentSlide = slides[currentPosition];

  const arrowRightClick = () => {
      currentPosition !== slides.length -1 ?
      setCurrentPosition(currentPosition + 1) : setCurrentPosition(currentPosition = 0);
      currentSlide = slides[currentPosition];
  }
  const arrowLeftClick = () => {
      currentPosition !== 0 ? 
      setCurrentPosition(currentPosition - 1) : setCurrentPosition(currentPosition = slides.length - 1);
      currentSlide = slides[currentPosition];
  }


  console.log(currentSlide)


  return (
      <div className={classes.root}>
          <div className={classes.image_url}>
              <img src={currentSlide.image_url} style={{width:'100%',height:'100%'}}/>
          </div>
          <div className={classes.container}>
              <div className={classes.carousel}>
                    {
                        currentPosition != 0 &&
                        <a className={classes.leftRow} onClick={arrowLeftClick}><KeyboardArrowLeftIcon style={{width:'50px',height:'50px'}} /></a>
                    }
                    {
                        currentPosition != slides.length - 1 &&
                        <a className={classes.rightRow} onClick={arrowRightClick}><KeyboardArrowRightIcon style={{width:'50px',height:'50px'}} /></a>
                    }
              </div>
          </div>
          <div className={classes.title}>
            <h3>{currentSlide.title}</h3>
          </div>
          <div className={classes.subtitle}>
            {
              <p>{currentSlide.description}</p>
            }
          </div>
          <div className={classes.buttonContainer}>
          <a href={currentSlide.link} className={classes.button}>{currentSlide.button_text}</a>
          </div>
      </div>
  )
}