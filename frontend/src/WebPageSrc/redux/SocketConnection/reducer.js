import {ADD_SOCKET_CONNECTION} from './type';


const initialState={
   socketObj:null
}


const SocketConnectionReducer=(state=initialState,action)=>{
    switch(action.type){
        case ADD_SOCKET_CONNECTION:return Object.assign({},state,{
            socketObj:action.payload
        })
        default:return state

    }
}

export default SocketConnectionReducer;