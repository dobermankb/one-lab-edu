import React, {useState, useEffect} from 'react'
import {Product} from './categoryPage'
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import Link from 'next/link';
const useStyles = makeStyles(() => ({
  root: {
      maxWidth: 240,
      textAlign:'center',
      marginBottom: '2px',
      marginTop: '5px',
  },
  media: {
      height: 0,
      paddingTop: '100%', // 16:9
  },

}));

interface Props{
  products:Product[]
}

export default function SearchPage({products}:Props){
  const classes = useStyles();
  const [input, setInput] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };
  let filteredProducts = [];
  if (input.length > 0) {
    filteredProducts = products.filter((i) => {
      return i.name.match(input);
    })
  }
  return <div> 
    <input type="text" placeholder="search products" className="box" onChange={handleChange} value={input}/>
    {filteredProducts.map((product, index) => {
    return(
      <>
        <ul>
            <Link href={''}>
                  <Card className={classes.root} elevation={4} key={index}>
                      <Image
                          className={classes.media}
                          src={product.imageURL}
                          title="Paella dish"
                          width={150}
                          height={150}
                      />
                      <CardHeader
                          title={product.name || "Iphone 13"}
                          subheader={`${product.description|| 'some description'}`}
                      />
                      <CardContent>
                          <Typography variant="body2" color="textSecondary" component="p">
                              {product.price || 3000}
                          </Typography>
                      </CardContent>
                  </Card>
              </Link> 
        </ul>
          
      </>
    )
  })}

  </div>
}
