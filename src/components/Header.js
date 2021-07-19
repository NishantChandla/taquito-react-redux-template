import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectWallet, disconnectWallet, incrementData, decrementData } from '../actions';

const Header = () => {
    const selector = useSelector(state => {return state.walletConfig.user});
    const dispatch = useDispatch();

    const onClick = (event) => {
        event.preventDefault();
        if(selector.userAddress===""){
            dispatch(connectWallet());
        }else{
            dispatch(disconnectWallet());
        }
    }

    return (
            <div className="ui menu black" style={{'marginTop':'5px'}}>
                <a href="/#" className="ui header item">Template</a>
                {(selector.userAddress!=="" )?(
                <a href="/#" className="item" onClick={()=>dispatch(incrementData())}>Increment Value</a>
                ):null
                }   

                {(selector.userAddress!=="" )?(
                <a href="/#" className="item" onClick={()=>dispatch(decrementData())}>Decrement Value</a>
                ):null
                } 

                <div className="right menu">
                    {(selector.userAddress==="")?
                    <a href="/#" className="item" onClick={onClick}>Connect Wallet</a>:
                    <a href="/#" className="item" onClick={onClick}>Disconnect Wallet</a>}
                </div>
            </div>
        );
}

export default Header;