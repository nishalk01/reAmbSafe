import {ADD_SOCKET_CONNECTION} from './type';


export const AddSocketConnection=(socketObj)=>{
    return{
        type:ADD_SOCKET_CONNECTION,
        payload:socketObj
}
}

