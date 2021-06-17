export const SwapArr=(arr)=>{
   var new_arr= arr.map(coordinate=>{
        [coordinate[0], coordinate[1]] = [coordinate[1], coordinate[0]];
    })
    return arr
}