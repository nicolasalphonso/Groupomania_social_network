import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Loginsubscribe from '../../pages/Loginsubscribe';
import Profil from '../../pages/Profil';
import Home from '../../pages/Home';

const index = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Loginsubscribe} />
                <Route path="/profil" exact component={Profil} />
                <Route path="/home" exact component={Home} />
                <Redirect to="/" />
            </Switch>
        </Router>
    );
};

export default index;