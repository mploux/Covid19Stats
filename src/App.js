import React, { Component } from 'react';
import LoadingView from './LoadingView';
import axios from 'axios';
import MapChart from "./MapChart";
import { Colors } from "./Colors";

class App extends Component {
  state = {
    global: null,
    countries: null,
    all: null,
    max: [],
    mapDisplay: 0,
    loaded: false,
    selectedCountry: null
  }
  
  async componentDidMount()
  {
    const global = await axios.get("https://coronavirus-19-api.herokuapp.com/all");
    const countries = await axios.get("https://coronavirus-19-api.herokuapp.com/countries");
    const all = await axios.get("https://coronavirus-tracker-api.herokuapp.com/all");

    console.log(countries.data[0]);

    const compare = (a, b) => {
      return b.latest - a.latest;
    }

    this.displays = [
      "cases",
      "deaths",
      "cured",
    ]

    this.setState({
      global: global.data, 
      countries: countries.data,
      all: all.data,
      max: [
        all.data.confirmed.locations.sort(compare)[0].latest,
        all.data.deaths.locations.sort(compare)[0].latest,
        all.data.recovered.locations.sort(compare)[0].latest
      ],
      loaded: true
    });
  }

  getCurrentColor = () => {
    return Object.values(Colors)[this.state.mapDisplay];
  }

  renderGlobalStats = (props) => {
    return (
      <div className="main-stats" style={{color: "rgb(" + this.getCurrentColor() + ")"}}>
        <div className="columns is-mobile is-gapless">
          <div className="column">
            <h2>Cases</h2>
            <h3>{props.data.confirmed}</h3>
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
      <div>
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
        <div className="countries marge">
          {renderAll}
        </div>
      </div>
    )
  }

  renderMap = () => {
    return (
      <div className="map">
        <MapChart data={this.state.all} max={this.state.max} display={this.state.mapDisplay} getData={(country) => {
          this.setState({
            selectedCountry: country
          })
        }} onMouseLeave={() => {
          this.setState({
            selectedCountry: null
          })
        }} />
      </div>
    )
  }

  setDisplay = (display) => {
    this.setState({mapDisplay: display});
  }

  render() {
    if (!this.state.loaded)
      return <LoadingView />
    return (
      <div>
        <this.renderMap />
        <div className="top">
          <h1>Coronavirus (COVID-19) realtime stats</h1>
          <this.renderGlobalStats data={this.state.all.latest} />
          {/* <this.renderAllCountries data={this.state.countries}/> */}
        </div>
        <div className={"switch " + (this.displays[this.state.mapDisplay])}>
          <div className={"switch-btn " + (this.displays[this.state.mapDisplay])}></div>
          <button onClick={() => {this.setDisplay(0)}} className={this.state.mapDisplay === 0 ? "selected" : 0}>Cases</button>
          <button onClick={() => {this.setDisplay(1)}} className={this.state.mapDisplay === 1 ? "selected" : 0}>Deaths</button>
          <button onClick={() => {this.setDisplay(2)}} className={this.state.mapDisplay === 2 ? "selected" : 0}>Cured</button>
        </div>
        <div className={"local-data " + (this.displays[this.state.mapDisplay])}>
          {this.state.selectedCountry ? (
          <div>
            <span className="data-ctry">{this.state.selectedCountry.country}</span>
            <div className="data">
              <span className="data-nbr">{this.state.selectedCountry.cases}</span>
              <span className="data-nbr">{this.state.selectedCountry.deaths}</span>
              <span className="data-nbr">{this.state.selectedCountry.cured}</span>
            </div>
          </div>
          ) : (
            <span className="hover">Hover or click on a country</span>
          )}
        </div>
        <div className="foot">
          <div className="container">
            Coronavirus statistics provided by the <a style={{color: "rgb(" + this.getCurrentColor() + ")"}} href="https://github.com/javieraviles/covidAPI" target="_blank">CovidAPI</a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
