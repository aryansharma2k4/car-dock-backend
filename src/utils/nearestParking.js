export function getNearestParkingSpace(parkingSpaces){
    const sorted = parkingSpaces.slice().sort();
    return sorted[0];
}

