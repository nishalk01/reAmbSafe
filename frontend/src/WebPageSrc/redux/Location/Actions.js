import {ADD_LOCATION} from './types';


export const AddUserLocation=(location)=>{
    return{
        type:ADD_LOCATION,
        payload:{"location":location}
    }
}



// {
// type: 'ADD_USER_LOCATION',
// payload:{"location":[12,72]}

// }