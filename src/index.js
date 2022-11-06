import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import persistedReducers from "./reducers";

const container = document.getElementById("root");
const root = createRoot(container);

const store = createStore(persistedReducers, applyMiddleware(thunk));

root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistStore(store)}>
			<App />
		</PersistGate>
	</Provider>
);
