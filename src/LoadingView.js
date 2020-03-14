import React, { Component } from 'react';

import "./styles/loader.scss";

class LoadingView extends Component {
    state = {  }
    render() { 
        return (
            <div className="loading-view">
                <div className="loading" id="loader">
                    <div className="loader-component" id="loader-component">
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default LoadingView;