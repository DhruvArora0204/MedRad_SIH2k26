import indiaRedZones from "./redzonedata.json";

export function validateIndianLocation(state, district) {
  for (const zone of indiaRedZones) {
    if (
      zone.state.toLowerCase() === state.toLowerCase() &&
      (!district || zone.district.toLowerCase() === district.toLowerCase())
    ) {
      return {
        isRedZone: true,
        riskLevel: zone.riskLevel,
        type: zone.type
      };
    }
  }
  return {
    isRedZone: false,
    riskLevel: "Low"
  };
}