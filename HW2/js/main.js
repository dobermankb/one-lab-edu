const inputs = document.getElementsByClassName('input')

add = () => {
    let arr1 = [inputs[0].value, inputs[1].value]
    let arr2 = [inputs[2].value, inputs[3].value]

    console.log(arr1, arr2)

    let from_ex = Array.from('array')  
  
    console.log(from_ex)  

    let of_ex = Array.of(77)

    console.log(of_ex)
    console.log(of_ex.length) //the length is 1, in ES5 it could be 77

    console.log(arr1.copyWithin(1))

    console.log(arr1.find((v) => v > 18))

    console.log(arr1.findIndex((v) => v > 18))

    let items = ["item1", "item2", "item3"]

    let show = items.entries()
    let show2 = items.keys()
    let show3 = items.values()
    let show4 = items.fill("item2", 1,3)
    
    console.log(...show)

    console.log(...show2)

    console.log(...show3)

    console.log(...show4)
};
