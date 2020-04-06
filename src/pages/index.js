import React, { useState, useEffect } from "react";

import Helmet from "react-helmet";
import L from "leaflet";
import api from "../services/api";

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";
import ContainerTotalCases from "../components/ContainerTotalCases";
import ContainerCases from "../components/ContainerCases";

const LOCATION = {
  lat: 68,
  lng: 7.7,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 3;

const IndexPage = () => {
  const [data, setData] = useState([]);

  const [totalCases, setTotalCases] = useState("");
  async function mapEffect({ leafletElement: map } = {}) {
    const hasData = Array.isArray(data) && data.length > 0;
    if (!hasData) return;
    const geoJson = {
      type: "FeatureCollection",
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: "Feature",
          properties: {
            ...country,
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        };
      }),
    };
    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latLng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const { country, updated, cases, deaths, recovered } = properties;

        casesString = `${cases}`;
        if (cases > 1000) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }

        if (updated) {
          updatedFormatted = new Date(updated).toLocaleString();
        }
        const html = `
        <span class="icon-marker">
          <span class="icon-marker-tooltip">
            <h2>${country}</h2>
            <ul>
              <li><strong>Confirmed:</strong> ${new Intl.NumberFormat(
                "pt-BR"
              ).format(cases)}</li>
              <li><strong>Deaths:</strong> ${new Intl.NumberFormat(
                "pt-BR"
              ).format(deaths)}</li>
            <li><strong>Recovered:</strong> ${new Intl.NumberFormat(
              "pt-BR"
            ).format(recovered)}</li>
            <li><strong>Last Update:</strong> ${updatedFormatted}</li>
            </ul>
            </span>
            ${casesString}
            </span>
        `;

        return L.marker(latLng, {
          icon: L.divIcon({
            className: "icon",
            html,
          }),
          riseOnHover: true,
        });
      },
    });

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/abauruel/ck8nhut0y0vho1iqhb80okfc1/tiles/256/{z}/{x}/{y}?access_token=${process.env.GATSBY_TOKEN}`,
      {
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(map);

    geoJsonLayers.addTo(map);
  }

  const mapSettings = {
    center: CENTER,
    zoomSnap: 0.5,
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  useEffect(() => {
    async function loadApi() {
      try {
        const response = await api.get("countries");
        setData(response.data);

        const total = await api.get("all");

        setTotalCases(total.data);
      } catch (error) {
        console.log(`Failed to fecth countries: ${error.message}`);
      }
    }
    loadApi();
  }, []);

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container>
        <ContainerTotalCases data={data} totalCases={totalCases} />
      </Container>
      <Map {...mapSettings} />

      <ContainerCases
        data={data}
        totalCases={totalCases.deaths}
        type="deaths"
        order="5"
      />
      <ContainerCases
        data={data}
        totalCases={totalCases.recovered}
        type="recovered"
        order="7"
      />
    </Layout>
  );
};

export default IndexPage;
