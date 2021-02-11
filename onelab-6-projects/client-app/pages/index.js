import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { loadDB } from '../lib/db'
import CategoryPage from '../components/categoryPage'
import SearchPage from '../components/searchPage'



export default function Home({products, categories}) {

  return (
    <div className="flex">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchPage products={products}/>
      <CategoryPage products={products} categories={categories}/>
    </div>
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
