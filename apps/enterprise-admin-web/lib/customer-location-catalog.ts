export type LocationCatalogOption = {
  code: string;
  name: string;
};

export type DistrictLocationCatalogOption = LocationCatalogOption & {
  neighborhoods: LocationCatalogOption[];
};

export type CantonLocationCatalogOption = LocationCatalogOption & {
  districts: DistrictLocationCatalogOption[];
};

export type ProvinceLocationCatalogOption = LocationCatalogOption & {
  cantons: CantonLocationCatalogOption[];
};

export const customerLocationCatalog: ProvinceLocationCatalogOption[] = [
  {
    code: "1",
    name: "San José",
    cantons: [
      {
        code: "19",
        name: "Pérez Zeledón",
        districts: [
          {
            code: "01",
            name: "San Isidro de El General",
            neighborhoods: [
              {
                code: "01",
                name: "Barrio Los Ángeles",
              },
              {
                code: "02",
                name: "Barrio Cooperativa",
              },
              {
                code: "03",
                name: "Villa Ligia",
              },
            ],
          },
          {
            code: "02",
            name: "General",
            neighborhoods: [
              {
                code: "01",
                name: "General Centro",
              },
              {
                code: "02",
                name: "Santa Elena",
              },
              {
                code: "03",
                name: "San Blas",
              },
            ],
          },
          {
            code: "03",
            name: "Daniel Flores",
            neighborhoods: [
              {
                code: "01",
                name: "Palmares",
              },
              {
                code: "02",
                name: "Villa Nueva",
              },
              {
                code: "03",
                name: "Repunte",
              },
            ],
          },
          {
            code: "04",
            name: "Rivas",
            neighborhoods: [
              {
                code: "01",
                name: "Rivas Centro",
              },
              {
                code: "02",
                name: "San Gerardo",
              },
              {
                code: "03",
                name: "Chimirol",
              },
            ],
          },
          {
            code: "05",
            name: "San Pedro",
            neighborhoods: [
              {
                code: "01",
                name: "San Pedro Centro",
              },
              {
                code: "02",
                name: "La Palma",
              },
              {
                code: "03",
                name: "San Rafael",
              },
            ],
          },
          {
            code: "06",
            name: "Platanares",
            neighborhoods: [
              {
                code: "01",
                name: "Platanares Centro",
              },
              {
                code: "02",
                name: "Santa Marta",
              },
              {
                code: "03",
                name: "San Pablo",
              },
            ],
          },
          {
            code: "07",
            name: "Pejibaye",
            neighborhoods: [
              {
                code: "01",
                name: "Pejibaye Centro",
              },
              {
                code: "02",
                name: "Guadalupe",
              },
              {
                code: "03",
                name: "Veracruz",
              },
            ],
          },
          {
            code: "08",
            name: "Cajón",
            neighborhoods: [
              {
                code: "01",
                name: "Cajón Centro",
              },
              {
                code: "02",
                name: "Santa Teresa",
              },
              {
                code: "03",
                name: "La Angostura",
              },
            ],
          },
          {
            code: "09",
            name: "Barú",
            neighborhoods: [
              {
                code: "01",
                name: "Barú Centro",
              },
              {
                code: "02",
                name: "Dominical",
              },
              {
                code: "03",
                name: "Hatillo",
              },
            ],
          },
          {
            code: "10",
            name: "Río Nuevo",
            neighborhoods: [
              {
                code: "01",
                name: "Río Nuevo Centro",
              },
              {
                code: "02",
                name: "Santa Rosa",
              },
              {
                code: "03",
                name: "Providencia",
              },
            ],
          },
          {
            code: "11",
            name: "Páramo",
            neighborhoods: [
              {
                code: "01",
                name: "Páramo Centro",
              },
              {
                code: "02",
                name: "San Ramón Sur",
              },
              {
                code: "03",
                name: "La Ese",
              },
            ],
          },
          {
            code: "12",
            name: "La Amistad",
            neighborhoods: [
              {
                code: "01",
                name: "La Amistad Centro",
              },
              {
                code: "02",
                name: "Altamira",
              },
              {
                code: "03",
                name: "Biolley",
              },
            ],
          },
        ],
      },
    ],
  },
];
