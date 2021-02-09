import {loadDB} from "./getDatabase";

export const getCategory = async () =>{
    const db = await loadDB()
    let data = []
    const querySnapshot = await db.firestore().collection('categories').get()
    querySnapshot.forEach(doc => {
        data.push(doc.data())
    })
    return data;
}
