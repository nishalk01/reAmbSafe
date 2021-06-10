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