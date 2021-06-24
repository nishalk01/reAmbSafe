export function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    
    return (false)
}

export function ValidatePhoneNumber(number){
  console.log(/^\d{10}$/.test(number))
  if(/^\d{10}$/.test(number)){
    
    return true
  }
  else return false
}


// get distance 

export const getDistance=(to,from)=>{
  try{
      const turf = window.turf;
      var fromt=turf.point(from);
      var tot=turf.point(to);
     
      var options = {units: 'kilometers'};
      var distance=turf.distance(fromt,tot,options)
      return distance
  }
  catch(err){
      console.log(err);
      return " "
  }
 


}


// sawp lng,lat to lat,lng and viceversa

export const swapLatLng=(coordinateArr)=>{
           let b=[] 
           coordinateArr.map(waypoint=>{
            b.push([waypoint[1],waypoint[0]])
           })
           return b 
}