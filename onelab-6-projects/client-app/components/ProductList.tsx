import { GetStaticProps } from 'next'

import {makeStyles} from '@material-ui/core/styles';


import { loadDB } from '../getDatabase'
import { getProducts } from '../getProducts'
import ProductCard from './ProductCard'
import React from 'react';
import { Link, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        
        textAlign:'center',
        
    },
    media: {
        height: 0,
        paddingTop: '100%', 
    },

}));


export interface Product{
    barcode: number,
    categoryName: string[],
    description: string,
    internalUid: string, 
    name: string, 
    price: number,
    status: boolean,
    uid: string,
    userUid: string,

}
export interface Category{
    level: number,
    name: string,
    parent: string,

}

export interface ProductInternal{
    barcode: number,
    categoryName: string[], 
    description: string, 
    name: string, 
    status: boolean, 
    uid: string,
}

interface Props{
    products: Product[],
    categories: Category[],
    products_internal: ProductInternal[],

}

export default function ProductList({products, categories, products_internal}: Props){
    const classes = useStyles();



    return(
        <>
            {categories.map((category, index) => (
                <>
                   
                    <>
                    <Link href={''}>
                        <a>
                            <h1>{category.name}</h1>
                        </a>
                    </Link> 
                    
                        {products.filter(product => product.categoryName.includes(category.name)).map((product, index) => 
                                (
                                    <ul>
                                         <ProductCard id={products_internal.uid} name={products_internal.name} price={products_internal.price} photoUrl={"https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/1200px-IPhone_X_vector.svg.png"}/>
                                    </ul>
                                )
                                
                        )}
                  
                    </> 
                    
                </>
            ))}

        </>
    )
    
}      


export async function getStaticProps() {
    const db = await loadDB()
    let products = []
    let categories = []
    let products_internal
    const querySnapshot = await db.firestore().collection('products').get()
    const querySnapshot2 = await db.firestore().collection('categories').get()
    const querySnapshot3 = await db.firestore().collection('products_internal').get()


    querySnapshot.forEach(doc => {
        products.push(doc.data())
    })
    querySnapshot2.forEach(doc => {
        categories.push(doc.data())
    })
    querySnapshot3.forEach(doc => {
        products_internal.push(doc.data())
    })

    return {
      props: {
        products,
        categories,
        products_internal,
      },
    }
  }