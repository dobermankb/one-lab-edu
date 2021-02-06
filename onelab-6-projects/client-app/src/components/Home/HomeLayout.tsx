import React, { useState } from "react";

import { Box, Slide } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';


// const quotes = [
//   { 
//     quote: "I love you the more in that I believe you had liked me for my own sake and for nothing else",
//     author: "John Keats"
//   },
//   { 
//     quote: "I have not failed. I've just found 10,000 ways that won't work.",
//     author: "Thomas A. Edison"
//   },
//   { 
//     quote: "But man is not made for defeat. A man can be destroyed but not defeated.",
//     author: "Ernest Hemingway"
//   },
//   {
//     quote: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
//     author: "Albert Einstein"
//   },
//   {
//     quote: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
//     author: "Jane Austen"
//   }  
// ];

// export default function Home() {
//   const [quoteData, getQuoteData] = useState(quotes);
//   const [current, setCurrent] = useState(0);
//   const [quote, getQuote] = useState(quoteData[current])
  
//   React.useEffect(
//     () => getQuote(quoteData[current]), 
//     [current, quote]
//   )
  
//   const nextQuote = () => {
//     current === quoteData.length-1 ? setCurrent(0) : setCurrent(current + 1)
//   }
  
//   const prevQuote = () => {
//     current === 0 ? setCurrent(quoteData.length-1) : setCurrent(current - 1)
//   }
  
//   function Slide({quote}) {
//     return (
//       <div>
//         <q>{quote.quote}</q>
//         <p>{quote.author}</p>
//       </div>
//     )
//   }
  
//   function Arrows({nextQuote, prevQuote}) {
//     return (
//       <>    
//         <a onClick={prevQuote}><KeyboardArrowLeftIcon /></a>
//         <a onClick={nextQuote}><KeyboardArrowRightIcon /></a>
//       </>
//     )
//   }

//   return(
//     <section>
//       <div>
//         <Slide quote={quote} />
//         <Arrows nextQuote={nextQuote}
//                 prevQuote={prevQuote} />
//       </div>
//     </section>
//   );
// }
const useStyles = makeStyles((theme) => ({
  root: {
  },
  image: {
    width:'100%',
    height:'45vh',
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
      marginTop:'-24vh'
  },
  carousel: {
      width:'99.82vw',
      position:'absolute',
  },
  title: {
      marginTop:'-15vh',
      marginLeft:'5%',
      position:'absolute',
      fontSize:'25px',
      color:'white',
      fontFamily:'Gill Sans Extrabold, sans-serif'
  },
  subtitle: {
    marginTop:'-10vh',
    marginLeft:'5%',
    position:'absolute',
    fontSize:'25px',
    color:'white',
    fontFamily:'Gill Sans Extrabold, sans-serif'
}
}));

export default function Carousel(){
  const classes = useStyles();
  const [slides] = useState([
      {
          source: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
          title: "Half Moon Pier",
          subtitle: "ASdasdas adsmkdasdl akasdkmasl ask dasld nlas"
      },
      {
          source: "https://wallpapercave.com/wp/wp4470725.jpg",
          title: "Port Washington Rocks",
          subtitle: "ASdDASDASDdsdadsdas asd asdasasd"
      },
      {
          source: "https://wallpapercave.com/wp/wp4470729.jpg",
          title: "Abandoned Rail",
          subtitle: "ASdsd asdasasads as a sadfneo fnew fwieof jwefwoefjwepfjweofjweofjwe"
      }
  ]);
  
  let [currentPosition, setCurrentPosition] = useState(0);
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
  return (
      <div className={classes.root}>
            <div className={classes.image}>
                <img src={currentSlide.source} style={{width:'100%',height:'100%'}}/>
            </div>
            <div className={classes.container}>
                <div className={classes.carousel}>
                    <a className={classes.leftRow} onClick={arrowLeftClick}><KeyboardArrowLeftIcon style={{width:'50px',height:'50px'}} /></a>
                    <a className={classes.rightRow} onClick={arrowRightClick}><KeyboardArrowRightIcon style={{width:'50px',height:'50px'}} /></a>
                </div>
          </div>
          <div className={classes.title}>
            <h3>{currentSlide.title}</h3>
          </div>
          <div className={classes.subtitle}>
            <p>{currentSlide.subtitle}</p>
          </div>
      </div>
  )
}