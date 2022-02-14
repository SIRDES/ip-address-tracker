import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonBase,
  Grid,
  Input,
  InputBase,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const styles = {
  topSection: {
    backgroundColor: "blue",
    backgroundImage: 'url("pattern-bg.png")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "30vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "2%",
  },
  cardContainer: {
    position: "absolute",
    margin: "11% 16%",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  cardItemTitle: {
    fontSize: "11px",
    marginBottom: "15px",
    textTransform: "uppercase",
    color: "hsl(0, 0%, 59%)",
    fontWeight: 400,
  },
  cardItemDetails: {
    fontSize: "26px",
    color: "hsl(0, 0%, 17%)",
    fontWeight: 700,
  },
};

function App() {
  // var map = L.map("map").setView([51.505, -0.09], 13);
  const mapRef = useRef();
  // const [inputValue, setInputValue] = useState("");
  // const [results, setResult] = useState([]);

  const results = {
    loading: true,
    ip: "",
    isp: "",
    city: "",
    timeZone: "",
    lat: 0,
    lng: 0,
  };
  const centerPosition = [results.lat, results.lng];

  const markerIcon = new L.Icon({
    iconUrl: "icon-location.svg",
    iconSize: [20, 30],
    draggable: true,
  });

  const [ipAddress, setIpAddress] = useState("");

  const GetData = () => {
    // setIpAddress();

    useEffect(() => {
      axios
        .get(
          `https:/geo.ipify.org/api/v2/country,city,vpn?apiKey=at_u2KYzDePrY9nyB8Gu7mD7yaqrGldn&ipAddress=${ipAddress}`
        )
        .then((res) => {
          const data = res.data;
          results.ip = data.ip;
          results.isp = data.isp;
          const location = data.location;
          results.city = location.city;
          results.country = location.country;
          results.lat = location.lat.toFixed(4);
          results.lng = location.lng.toFixed(4);
          results.timeZone = location.timeZone
          results.loading = false;
          console.log(location);
        })
        .catch((error) => console.log(error.message));
      // Update the document title using the browser API
      // document.title = `You clicked ${count} times`;
    }, []);
  };
  GetData();
  const handleSubmit = (e) => {
    e.preventDefault();
    // const regexIp =
    //   /^\b([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b(\.\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b){3}$/;
    // const regexDomain =
    //   /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    // if (!myInput.value.match(regexDomain) && !myInput.value.match(regexIp)) {
    //   myInput.classList.add("error");

    //   setTimeout(() => myInput.classList.remove("error"), 3000);
    // }
    GetData();
    setIpAddress("");
    
  };
  return (
    <Grid container xs={12}>
      <Grid item xs={12} style={styles.topSection}>
        <Typography
          variant="h4"
          style={{ marginBottom: "10px", fontSize: "26px", fontWeight: 500 }}
        >
          IP Address Tracker
        </Typography>

        <form onSubmit={handleSubmit}>
          <InputBase
            style={{
              fontSize: "18px",
              // border: "1px solid grey",
              backgroundColor: "#fff",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
              padding: "8px 50px 8px 15px",
            }}
            id="inputField"
            value={ipAddress}
            placeholder="enter ip address"
            // onChange={(e) => setIpAddress(e.target.value)}
          />
          <ButtonBase
            type="submit"
            style={{
              width: "42px",
              height: "51px",
              // backgroundImage: 'url("icon-arrow.svg")',
              backgroundColor: "hsl(0, 0%, 17%)",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              // padding: 0,
            }}
            src="icon-arrow.svg"
          >
            <img src="icon-arrow.svg" alt="icon" />
          </ButtonBase>
        </form>
      </Grid>
      <Grid style={styles.cardContainer} item container md={8}>
        <Grid item md={3} xs={10} style={{ borderRight: "1px solid grey" }}>
          <Typography style={styles.cardItemTitle}>IP Address</Typography>
          <Typography style={styles.cardItemDetails}>{results.ip}</Typography>
        </Grid>
        <Grid
          item
          md={3}
          xs={10}
          style={{ borderRight: "1px solid grey", paddingLeft: "20px" }}
        >
          <Typography style={styles.cardItemTitle}>Location</Typography>
          <Typography style={styles.cardItemDetails}>
            {results.city},{results.country}
          </Typography>
        </Grid>
        <Grid
          item
          md={3}
          xs={10}
          style={{ borderRight: "1px solid grey", paddingLeft: "20px" }}
        >
          <Typography style={styles.cardItemTitle}>Timezone</Typography>
          <Typography style={styles.cardItemDetails}>UTC - {results.timeZone}</Typography>
        </Grid>
        <Grid item md={3} xs={10} style={{ paddingLeft: "20px" }}>
          <Typography style={styles.cardItemTitle}>isp</Typography>
          <Typography style={styles.cardItemDetails}>{results.isp}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ height: "70vh" }}>
        <MapContainer
          id="map"
          center={centerPosition}
          ref={mapRef}
          zoom={13}
          style={{ height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={centerPosition} icon={markerIcon}>
            <Popup>
              <Typography style={{ color: "maroon" }}>Your are here</Typography>
            </Popup>
          </Marker>
        </MapContainer>
      </Grid>
    </Grid>
  );
}

export default App;
