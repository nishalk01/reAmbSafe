import {ADD_LOCATION} from './types';


const initialState={
    location:[]  
}


const LocationReducer=(state=initialState,action)=>{
    switch(action.type){
        case ADD_LOCATION:return Object.assign({},state,{
            location:[action.payload]
        })
        default:return state

    }
}

export default LocationReducer;