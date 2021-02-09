import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from  'next/link';
import { loadDB } from '../lib/db'
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Image from 'next/image';
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
export interface Product{
    name: string,
    price: number,
    imageURL: string,
    categoryNames: string[],
    description?: string
}
export interface Category{
    name: string,
    checked: boolean
}
interface Props {
    products: Product[],
    categories: Category[]

}
export default function CategoryPage({products,categories}: Props){
    const classes = useStyles();
    return (
        <>
            {categories.map((category, index) => (
                <>
                    {category.checked ? 
                    <>
                    <Link href={''}>
                        <a>
                            <h1>{category.name}</h1>
                        </a>
                    </Link> 
                    <Carousel
                    key={index}
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode
                    className=""
                    containerClass="container"
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite={false}
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={{
                        desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1024
                        },
                        items: 4,
                        partialVisibilityGutter: 40
                        },
                        mobile: {
                        breakpoint: {
                            max: 464,
                            min: 0
                        },
                        items: 1,
                        partialVisibilityGutter: 30
                        },
                        tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 464
                        },
                        items: 3,
                        partialVisibilityGutter: 30
                        }
                    }}
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={3}
                    swipeable
                    >
                        {products.filter(product => product.categoryNames.includes(category.name)).map((product, index) => 
                                (
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
                                )
                                
                        )}
                    </Carousel> 
                    </> : ''
                    }
                </>
            ))}
            

        </>
        
    )
}



export async function getStaticProps() {
    const db = await loadDB()
    let products = []
    let categories = []
    const querySnapshot = await db.firestore().collection('products').get()
    const querySnapshot2 = await db.firestore().collection('categories').get()

    querySnapshot.forEach(doc => {
      products.push(doc.data())
    })
    querySnapshot2.forEach(doc => {
        categories.push(doc.data())
      })

    return {
      props: {
        products,
        categories,
      },
    }
  }
