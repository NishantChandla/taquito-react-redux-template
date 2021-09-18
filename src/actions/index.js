import { TezosToolkit } from "@taquito/taquito";
import {
  NetworkType,
} from "@airgap/beacon-sdk";
import config from '../config';



export const connectWallet = ({wallet, Tezos}) => {
    return async (dispatch)=>{
        try {
            var payload = {};

            Tezos.setWalletProvider(wallet)

            const activeAccount = await wallet.client.getActiveAccount();
            if(!activeAccount){
                await wallet.requestPermissions({
                network: {
                    type: NetworkType.FLORENCENET,
                    rpcUrl: "https://florencenet.smartpy.io/"
                }
                });
            }
            const userAddress = await wallet.getPKH();
            const balance = await Tezos.tz.getBalance(userAddress);

            payload.user = {
                userAddress : userAddress,
                balance : balance.toNumber()
            }
            dispatch(_walletConfig(payload.user));

          } catch (error) {
              console.log(error);
              dispatch({
                  type: "CONNECT_WALLET_ERROR",
              })  
        }
    }
}

export const _walletConfig = (user) => {
    return {
        type:"CONNECT_WALLET",
        user,
    }
}

export const disconnectWallet = ({wallet, setTezos}) => {
    return async (dispatch) => {

        setTezos(new TezosToolkit("https://florencenet.smartpy.io/"));

        dispatch({
            type:"DISCONNECT_WALLET",
        });

        if(wallet){
            await wallet.client.removeAllAccounts();
            await wallet.client.removeAllPeers();
            await wallet.client.destroy();
        }
      };
}
export const fetchContractData = ({Tezos}) => {
    return async (dispatch, getState) => {
        try {
            const contract = await Tezos.wallet.at(config.contractAddress);

            const storage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: storage.toNumber()});
        }catch(e){
            //dispatch
            console.log(e);
        }
    }
}

export const incrementData = ({Tezos}) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);

            const op = await contract.methods.increment(1).send();
            await op.confirmation();
            const newStorage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: newStorage.toNumber()});
        }catch(e){
            console.log(e);
        }
    }
}


export const decrementData = ({Tezos}) => {
    return async (dispatch, getState) => {
        try{
            const contract = await Tezos.wallet.at(config.contractAddress);

            const op = await contract.methods.decrement(1).send();
            await op.confirmation();
            const newStorage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: newStorage.toNumber()});
        }catch(e){
            console.log(e);
        }
    }
}