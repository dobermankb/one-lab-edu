import { GetStaticProps } from 'next'
import { loadDB } from '../getDatabase'
import { getProducts } from '../getProducts'
import ProductCard from './ProductCard'

export default function ProductList({data}){


    return(
        <>

        </>
    )
    
}      


export const getStaticProps: GetStaticProps = async () => {
    let data = await getProducts();
    console.log(data);
    return {
        props: {
            data
        }
    }
}