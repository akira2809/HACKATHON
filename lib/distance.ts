export type Coordinates = {
    latitude: number;
    longitude: number;
};

const EARTH_RADIUS_METERS = 6371000;

function toRadians(value: number) {
    return (value * Math.PI) / 180;
}

export function haversineDistanceInMeters(from: Coordinates, to: Coordinates) {
    const deltaLatitude = toRadians(to.latitude - from.latitude);
    const deltaLongitude = toRadians(to.longitude - from.longitude);
    const fromLatitude = toRadians(from.latitude);
    const toLatitude = toRadians(to.latitude);

    const a = Math.sin(deltaLatitude / 2) ** 2
        + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(deltaLongitude / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;
}

export function isWithinDistance(from: Coordinates, to: Coordinates, maxDistanceMeters: number) {
    return haversineDistanceInMeters(from, to) <= maxDistanceMeters;
}

export function formatDistance(distanceInMeters: number) {
    if (distanceInMeters < 1000) {
        return `${Math.round(distanceInMeters)} m`;
    }

    return `${(distanceInMeters / 1000).toFixed(1)} km`;
}
