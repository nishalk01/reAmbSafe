import {ADD_NOTIFICATION} from './types';


const initialState={
    notification:[],
    new_notification:[]  
}


const NotificationReducer=(state=initialState,action)=>{
    switch(action.type){
        case ADD_NOTIFICATION:return Object.assign({},state,{
            notification:[
                ...state.notification,
                action.payload],
            new_notification:[action.payload]
        })
        default:return state

    }
}

export default NotificationReducer;