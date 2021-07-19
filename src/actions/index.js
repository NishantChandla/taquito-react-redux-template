import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";
import config from '../config';

export const tezosInstance = () => {
    return async (dispatch, getState) => {
        const { walletConfig } = getState();
        if(walletConfig.tezos.tezosToolkit === null){
            const tezosToolkit =  new TezosToolkit("https://florencenet.smartpy.io/")
            dispatch({type:"TEZOS_INSTANCE", tezos:{tezosToolkit:tezosToolkit}});
        }
    } 
}

export const contractInstanceAction = () => {
    return async (dispatch, getState) => {
        await dispatch(tezosInstance());
        const { contractInstance, walletConfig } = getState();
        var contract = contractInstance.contract;
        if(!contractInstance.hasData){
            contract = await walletConfig.tezos.tezosToolkit.wallet.at(config.contractAddress);
            dispatch({type:"CREATE_CONTRACT_INSTANCE", payload:{hasData:true, contract}})
        }
    } 
}

export const connectWallet = () => {
    return async (dispatch, getState)=>{
        try {
            await dispatch(tezosInstance());
            const { walletConfig } = getState();

            console.log(walletConfig)
            var tezosToolkit = walletConfig.tezos.tezosToolkit;
            var wallet = walletConfig.beacon.wallet;
            var publicToken = walletConfig.beacon.publicToken;
            var payload = {};

            if(!walletConfig.beacon.beaconConnection){
                wallet = new BeaconWallet({
                    name: "Template",
                    preferredNetwork: NetworkType.FLORENCENET,
                    disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
                    eventHandlers: {
                    // To keep the pairing alert, we have to add the following default event handlers back
                    [BeaconEvent.PAIR_INIT]: {
                        handler: defaultEventCallbacks.PAIR_INIT
                    },
                    [BeaconEvent.PAIR_SUCCESS]: {
                        handler: data => { return publicToken = (data.publicKey);}
                    }
                    }
                });
            }
            tezosToolkit.setWalletProvider(wallet)

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
            const balance = await tezosToolkit.tz.getBalance(userAddress);
            payload.tezos = {
                tezosToolkit: tezosToolkit
            }
            payload.beacon = {
                wallet: wallet,
                beaconConnection: true,
                publicToken: publicToken
            }
            payload.user = {
                userAddress : userAddress,
                balance : balance.toNumber()
            }
            dispatch(_walletConfig(payload.user, payload.tezos, payload.beacon));

          } catch (error) {
              console.log(error);
              dispatch({
                  type: "CONNECT_WALLET_ERROR",
                  beacon: {
                      beaconConnection: false
                  }
              })  
        }
    }
}

export const _walletConfig = (user, tezos, beacon) => {
    return {
        type:"CONNECT_WALLET",
        tezos,
        user,
        beacon
    }
}

export const disconnectWallet = () => {
    return async (dispatch, getState) => {
        //window.localStorage.clear();
        const { walletConfig } = getState();
        const tezosToolkit =  new TezosToolkit("https://florencenet.smartpy.io/");

        dispatch({
            type:"DISCONNECT_WALLET",
            tezos:{tezosToolkit:tezosToolkit}
        });

        if(walletConfig.beacon.wallet){
            await walletConfig.beacon.wallet.client.removeAllAccounts();
            await walletConfig.beacon.wallet.client.removeAllPeers();
            await walletConfig.beacon.wallet.client.destroy();
        }
      };
}

export const fetchContractData = () => {
    return async (dispatch, getState) => {
        try {
            await dispatch(tezosInstance());
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            var contract = contractInstance.contract;

            const storage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: storage.toNumber()});
        }catch(e){
            //dispatch
            console.log(e);
        }
    }
}

export const incrementData = () => {
    return async (dispatch, getState) => {
        try{
            //update balance if necessary
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            var contract = contractInstance.contract;

            const op = await contract.methods.increment(1).send();
            await op.confirmation();
            const newStorage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: newStorage.toNumber()});
        }catch(e){
            console.log(e);
        }
    }
}


export const decrementData = () => {
    return async (dispatch, getState) => {
        try{
            await dispatch(contractInstanceAction());
            const { contractInstance } = getState();
            var contract = contractInstance.contract;

            const op = await contract.methods.decrement(1).send();
            await op.confirmation();
            const newStorage = await contract.storage();
            dispatch({type:"SET_VALUE", payload: newStorage.toNumber()});
        }catch(e){
            console.log(e);
        }
    }
}