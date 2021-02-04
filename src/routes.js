import React, { Fragment, Suspense } from "react";
import { GuardProvider, GuardedRoute } from "react-router-guards";
import { Switch } from "react-router-dom";
import MagicRectangleLoader from "./components/Elements/MagicRectangleLoader";
import HomePage from "./components/HomePage/HomePage";

export default () => {
    return (
        <GuardProvider loading={() => <MagicRectangleLoader />}>
            <Suspense fallback={<div><p>Npt wprla</p></div>}>
                <Switch>
                    <GuardedRoute
                        path="/"
                        exact
                        component={HomePage}
                        meta={{ guest: true }}
                    />
                </Switch>
            </Suspense>
        </GuardProvider>
    )
}