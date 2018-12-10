import { Store, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    logger,
    login,
    logout,
    getOracleInfo,
    setOracleInfo,
    getOracleData,
    setOracleToken,
} from 'app/middleware';
import { RootState, rootReducer } from 'app/reducers';

export function configureStore(initialState?: RootState): Store<RootState> {
    let middleware = applyMiddleware(
        logger,
        login,
        logout,
        getOracleInfo,
        setOracleInfo,
        getOracleData,
        setOracleToken,
    );
    
    if (process.env.NODE_ENV !== 'production') {
        middleware = composeWithDevTools(middleware);
    }
    
    const store = createStore(
        rootReducer as any,
        initialState as any,
        middleware
    ) as Store<RootState>;
    
    if (module.hot) {
        module.hot.accept('app/reducers', () => {
            const nextReducer = require('app/reducers');
            store.replaceReducer(nextReducer);
        });
    }
    
    return store;
}
