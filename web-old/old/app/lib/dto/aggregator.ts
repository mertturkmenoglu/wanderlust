export type HomeAggregatorResponseDto = {
  new: HomeAggregatorPoi[];
  popular: HomeAggregatorPoi[];
  featured: HomeAggregatorPoi[];
  favorites: HomeAggregatorPoi[];
};

export type HomeAggregatorPoi = {
  id: string;
  name: string;
  addressId: number;
  address: HomeAggregatorPoiAddress;
  categoryId: number;
  category: HomeAggregatorPoiCategory;
  media: HomeAggregatorPoiMedia;
};

export type HomeAggregatorPoiAddress = {
  id: number;
  cityId: number;
  city: HomeAggregatorPoiCity;
  line1: string;
  line2: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
};

export type HomeAggregatorPoiCity = {
  id: number;
  name: string;
  stateCode: string;
  stateName: string;
  countryCode: string;
  countryName: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  description: string;
};

export type HomeAggregatorPoiCategory = {
  id: number;
  name: string;
  image: string;
};

export type HomeAggregatorPoiMedia = {
  id: number;
  poiId: string;
  url: string;
  thumbnail: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  mediaOrder: number;
  extension: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
};
