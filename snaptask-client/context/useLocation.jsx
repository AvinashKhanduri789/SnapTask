import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useApi } from "../util/useApi";
import { api } from "../util/requester";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const { request, isLoading, error } = useApi();

  const updateLocationOnServer = async (lat, lng, userAddress) => {
    try {
      const locationData = { latitude: lat, longitude: lng, address: userAddress };
      console.log("Sending location to server:", locationData);

      const response = await request(api.put("/common/location", locationData));

      if (response.ok) {
        console.log("Location updated successfully on server");
        return true;
      } else {
        console.warn(" Failed to update location on server:", response.error);
        return false;
      }
    } catch (err) {
      console.warn(" Error updating location on server");
      return false;
    }
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (response && response.length > 0) {
        const location = response[0];
        const addressString = [
          location.name,
          location.street,
          location.city,
          location.region,
          location.country
        ]
          .filter(Boolean)
          .join(", ");
        return addressString || "Address not available";
      }
      return "Address not available";
    } catch {
      console.warn(" Unable to fetch address");
      return "Address not available";
    }
  };

  const getUserLocation = async (shouldUpdateServer = true) => {
    try {
      setIsLocationLoading(true);
      setErrorMsg(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return null;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
        const { latitude, longitude } = coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log(" Lat and Long:", latitude, longitude);

        const userAddress = await getAddressFromCoords(latitude, longitude);
        setAddress(userAddress);
        console.log(" User Address:", userAddress);

        if (shouldUpdateServer) {
          const updateSuccess = await updateLocationOnServer(latitude, longitude, userAddress);
          if (!updateSuccess) {
            console.warn("Location was fetched but failed to update on server");
          }
        }

        return { latitude, longitude, address: userAddress };
      }
      return null;
    } catch (error) {
      setErrorMsg(error.message);
      console.warn(" Unable to fetch location");
      return null;
    } finally {
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation(true);
  }, []);

  return {
    latitude,
    longitude,
    address,
    errorMsg,
    isLoading: isLocationLoading || isLoading,
    apiError: error,
    getUserLocation,
    updateLocationOnServer
  };
};

export default useLocation;
