import React, {Component} from 'react';
import Navbar from '../components/Navbar'
import activity from 'lib/sugar-web/activity/activity'
import env from 'lib/sugar-web/env'
import {connect} from "react-redux"
import {IntlProvider} from "react-intl";
import {MemoryRouter as Router} from "react-router-dom";
import {addLocaleData} from "react-intl";
import messages from "../translations/lang"
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import locale_es from 'react-intl/locale-data/es';

import Main from "./Router";
import '../css/index.css';
import {setExercises} from "../store/actions/exercises";

class Sugarizer extends Component {

    constructor(props) {
        super(props);

        addLocaleData([...locale_en, ...locale_fr, ...locale_es]);

        this.language = navigator.language.split(/[-_]/)[0];
    }

    componentDidMount() {
        activity.setup();

        let currentenv;
        let temp = this;
        env.getEnvironment(function (err, environment) {
            currentenv = environment;

            // Load from datastore
            if (!environment.objectId) {
                console.log("New instance");
            } else {
                activity.getDatastoreObject().loadAsText(function (error, metadata, data) {
                    if (error === null && data !== null) {
                        console.log("object found!");
                        let state = JSON.parse(data);
                        temp.setState(state);
                    }
                });
            }
        })
    }

    stopActivity() {

    }

    render() {
        return (
            <IntlProvider locale={this.language} messages={messages[this.language]}>
                <Router>
                    <div className="App-container">
                        <Navbar onStop={() => this.stopActivity()}/>
                        <Main/>
                    </div>
                </Router>
            </IntlProvider>
        );
    }
}

function MapStateToProps(state) {
    return {
        counter: state.exercise_counter,
        exercises: state.exercises
    }
}

export default connect(MapStateToProps,{setExercises})(Sugarizer);