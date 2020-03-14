import React, { Component } from 'react';
import LoadingView from './LoadingView';
import axios from 'axios';

class App extends Component {
  state = {
    global: null,
    countries: null,
    loaded: false
  }
  
  async componentDidMount()
  {
    const global = await axios.get("https://coronavirus-19-api.herokuapp.com/all");
    const countries = await axios.get("https://coronavirus-19-api.herokuapp.com/countries");

    this.setState({
      global: global.data, 
      countries: countries.data, 
      loaded: true
    });
  }

  renderGlobalStats = (props) => {
    return (
      <div className="main-stats">
        <div className="columns">
          <div className="column">
            <h2>Cases</h2>
            <h3>{props.data.cases}</h3>
          </div>
          <div className="column">
            <h2>Deaths</h2>
            <h3>{props.data.deaths}</h3>
          </div>
          <div className="column">
            <h2>Cured</h2>
            <h3>{props.data.recovered}</h3>
          </div>
        </div>
      </div>
    )
  }

  renderCountryStat = (props) => {
    return (
      <div className="country-stat">
        <div className="columns">
          <div className="column is-two-fifths">
            <h4 className="title">{props.data.country}</h4>
          </div>
          <div className="column has-text-centered">
            <div className="columns is-mobile level is-hidden-tablet">
              <h4 className="column" style={{marginTop: 0}}>Cases</h4>
              <h5 className="column">{props.data.cases}</h5>
            </div>
            <h5 className="is-hidden-mobile">{props.data.cases}</h5>
          </div>
          <div className="column has-text-centered">
            <div className="columns is-mobile level is-hidden-tablet">
              <h4 className="column" style={{marginTop: 0}}>Deaths</h4>
              <h5 className="column">{props.data.deaths}</h5>
            </div>
            <h5 className="is-hidden-mobile">{props.data.deaths}</h5>
          </div>
          <div className="column has-text-centered">
            <div className="columns is-mobile level is-hidden-tablet">
              <h4 className="column" style={{marginTop: 0}}>Cured</h4>
              <h5 className="column">{props.data.recovered}</h5>
            </div>
            <h5 className="is-hidden-mobile">{props.data.recovered}</h5>
          </div>
        </div>
      </div>
    )
  }

  renderAllCountries = (props) => {
    let renderAll = [];

    props.data.forEach(c => {
      renderAll.push(<this.renderCountryStat data={c}/>);
    });
    
    return (
      <div className="countries marge">
        {renderAll}
      </div>
    )
  }

  render() {
    if (!this.state.loaded)
      return <LoadingView />
    return (
      <div>
        <div className="container">
          <h1>Coronavirus (COVID-19) realtime stats</h1>
          <this.renderGlobalStats data={this.state.global}/>
          <h1>By countries</h1>
          <div className="columns countries is-hidden-mobile">
            <div className="column is-two-fifths">
            </div>
            <div className="column has-text-centered">
              <h4 className="weight-black">Cases</h4>
            </div>
            <div className="column has-text-centered">
              <h4 className="weight-black">Deaths</h4>
            </div>
            <div className="column has-text-centered">
              <h4 className="weight-black">Cured</h4>
            </div>
          </div>
          <this.renderAllCountries data={this.state.countries}/>
        </div>
        <div className="foot">
          <div className="container">
            Coronavirus statistics provided by the <a href="https://github.com/javieraviles/covidAPI" target="_blank">CovidAPI</a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
