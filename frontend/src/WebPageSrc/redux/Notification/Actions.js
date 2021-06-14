import {ADD_NOTIFICATION} from './types';


export const AddNewNotification=(notification)=>{
    return{
        type:ADD_NOTIFICATION,
        payload:notification
}
}

