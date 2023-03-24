import React from "react";
import { Provider } from "react-redux";
import App from "next/app";
import initializeStore from "../../redux/store";

import { fetchPropertiesPromise, updateProperty, fetchPropertyPending, fetchPropertyError } from "../../redux/actions/properties";
import { fetchDoctorsPromise, fetchDoctors } from "../../redux/actions/doctors";

export const withRedux = (PageComponent, req, { ssr = true } = {}) => {
    const WithRedux = ({ initialReduxState, ...props }) => {
        const store = getOrInitializeStore(initialReduxState);

        return (
            <Provider store={store}>
                <PageComponent {...props} />
            </Provider>
        );
    };

    // Make sure people don't use this HOC on _app.js level
    if (process.env.NODE_ENV !== "production") {
        const isAppHoc = PageComponent === App || PageComponent.prototype instanceof App;
        if (isAppHoc) {
            throw new Error("The withRedux HOC only works with PageComponents");
        }
    }

    // Set the correct displayName in development
    if (process.env.NODE_ENV !== "production") {
        const displayName = PageComponent.displayName || PageComponent.name || "Component";

        WithRedux.displayName = `withRedux(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
        WithRedux.getInitialProps = async context => {
            //            const dispatch = useDispatch();
            // Get or Create the store with `undefined` as initialState
            // This allows you to set a custom default initialState
            const reduxStore = getOrInitializeStore();

            if (reduxStore) {
                const myState = reduxStore.getState();
                //                console.log(myState.properties.equipment.length);
                if (myState.properties.equipment.length === 0) {
                    // only call this when reduxStore is not filled with data
                    await fetchPropertiesPromise()
                        .then(results => {
                            results.forEach((result, key) => reduxStore.dispatch(updateProperty(key + 1, result)));
                            reduxStore.dispatch(fetchPropertyPending(false));
                        })
                        .catch(err => reduxStore.dispatch(fetchPropertyError(err)));
                    /* 
                    await fetchDoctorsPromise()
                        .then(response => {
                            reduxStore.dispatch(fetchDoctors(response));
                        })
                        .catch(error => {
                            // console.log(error);
                        }); */
                    /*
                    await fetchUserPromise()
                        .then(response => {
                            console.log(response);
                            reduxStore.dispatch(fetchUser(response));
                        })
                        .catch(error => {
                            console.log(error);
                        });
                        */

                    // Provide the store to getInitialProps of pages
                    context.reduxStore = reduxStore;
                }
            }
            // Run getInitialProps from HOCed PageComponent
            const pageProps = typeof PageComponent.getInitialProps === "function" ? await PageComponent.getInitialProps(context) : {};

            // Pass props to PageComponent
            return {
                ...pageProps,
                initialReduxState: reduxStore.getState()
            };
        };
    }

    return WithRedux;
};

let reduxStore;

const getOrInitializeStore = initialState => {
    // Always make a new store if server, otherwise state is shared between requests
    if (typeof window === "undefined") {
        return initializeStore(initialState);
    }

    // Create store if unavailable on the client and set it on the window object
    if (!reduxStore) {
        reduxStore = initializeStore(initialState);
    }

    return reduxStore;
};
