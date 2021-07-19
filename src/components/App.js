import React,{ useEffect } from 'react';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContractData } from '../actions';

const App = () => {
    const selector = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchContractData());
    },[dispatch]);

    return (
        <div className="ui container">
            <Header />
            <div className="ui container center aligned">
                <p className="ui">User Address: {selector.walletConfig.user.userAddress}</p>
                <p className="ui">User Balance: {selector.walletConfig.user.balance}</p>
                <p className="ui">Storage: {selector.contractStorage} </p>
            </div>
        </div>
    );
}

export default App;