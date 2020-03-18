import React, { memo } from "react";
import { ZoomableGroup, ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Colors } from "./Colors";

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = (props) => {
  return (
    <div>
      <ComposableMap data-tip=""
        width={window.innerWidth}
        height={window.innerHeight}
        projection="geoMercator"
        projectionConfig={{
            scale: 700
        }}>
        <ZoomableGroup
            center={[0, 45]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const casesData = props.data.confirmed.locations.find(c => c.country_code === geo.properties.ISO_A2);
                const deathsData = props.data.deaths.locations.find(c => c.country_code === geo.properties.ISO_A2);
                const curedData = props.data.recovered.locations.find(c => c.country_code === geo.properties.ISO_A2);
                
                const data = [
                    casesData ? casesData.latest : 0,
                    deathsData ? deathsData.latest : 0,
                    curedData ? curedData.latest : 0
                ]

                let display = props.display;
                const countryOpacity = 0.04 + (data[display] / props.max[display]) * 0.98; 
                const countryColor = Object.values(Colors)[display];

                return (<Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                        props.getData({
                            country: geo.properties.NAME,
                            cases: data[0], 
                            deaths: data[1], 
                            cured: data[2]
                        });
                    }}
                    onMouseLeave={() => {
                        props.onMouseLeave();
                    }}
                    style={{
                      default: {
                        fill: "rgba(" + countryColor + ", " + countryOpacity + ")",
                        outline: "none",
                        stroke: "#ffffff"
                      },
                      hover: {
                        fill: "rgba(" + countryColor + ", 0.6)",
                        outline: "none",
                        stroke: "#ffffff"
                      },
                      pressed: {
                        fill: "rgba(" + countryColor + ", 0.6)",
                        outline: "none",
                        stroke: "#ffffff"
                      }
                    }}
                  />)
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);