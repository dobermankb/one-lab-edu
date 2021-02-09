import {loadDB} from "./getDatabase";

export const getProducts = async () =>{
    const db = await loadDB()
    let data = []
    const querySnapshot = await db.firestore().collection('products').get()
    querySnapshot.forEach(doc => {
        data.push(doc.data())
    })
    return data;
}
