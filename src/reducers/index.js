import { combineReducers } from "redux"

const initialWalletState = {
    user: {
        userAddress : "",
        userBalance : 0,
    },
    tezos: {
        tezosToolkit: null,
    },
    beacon: {
        beaconConnection: false,
        publicToken: null,
        wallet: null
    }
}


const connectWalletReducer = (config = initialWalletState, action) => {
    switch(action.type){
        case "CONNECT_WALLET":
            return {...config,user: action.user, 
                        tezos: action.tezos, 
                        beacon: action.beacon};
        case "DISCONNECT_WALLET":
            return {...initialWalletState,
                        tezos: action.tezos
                    };
        case "TEZOS_INSTANCE":
            return {...config, tezos: action.tezos}
        case "CONNECT_WALLET_ERROR":
            return config;
        default:
            return config;
    }
}

const contractInstanceReducer = (state={hasData:false, contract:null}, action) => {
    switch(action.type){
        case "CREATE_CONTRACT_INSTANCE":
            return action.payload;
        default:
            return state;
    }
}

const contractStorageReducer = (state=0, action) => {
    switch(action.type){
        case "SET_VALUE":
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({walletConfig: connectWalletReducer, contractStorage: contractStorageReducer, contractInstance: contractInstanceReducer});