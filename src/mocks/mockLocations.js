const mockLocations = {
  features: [
    {
      type: "Feature",
      properties: {
        id: "1",
        name: "Lele's home",
        description: "Carrer Templers Home",
        images: "",
      },
      geometry: {
        type: "Point",
        coordinates: [41.38184338079825, 2.1788420566189455],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "2",
        name: "Francesco's home",
        description: "Carrer Carretes Home",
        images: "",
      },
      geometry: {
        type: "Point",
        coordinates: [41.37822586448357, 2.1669059934929518],
      },
    },
  ],
};

module.exports = mockLocations;
