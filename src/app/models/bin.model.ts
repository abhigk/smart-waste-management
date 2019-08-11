
const areasEnum  = Object.freeze({'location1': 'location1', 'location2': 'location2'});


export class Bin {
    private capacity: number;
    private location: {latitude: number, longitude: number};
    private hardwareId: string;
    private location_area: string;
    private tags: string[];
    private currentLevel: number;
    private lastUpdated: Date;


    constructor(capacity: number, location: {latitude: number, longitude: number},
         hardwareId: string, location_area: string, tags: string[]) {
        this.capacity = capacity;
        this.location = location;
        this.hardwareId = hardwareId;
        this.location_area = location_area;
        this.tags = tags;
        this.currentLevel = 0;
    }

    getLastUpdated() {
        return this.lastUpdated;
    }

    setLastUpdated(time: Date) {
        this.lastUpdated = time;
    }

    setCurrentLevel(level: number) {
        this.currentLevel = level;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getCapacity() {
        return this.capacity;
    }

    getLocation() {
        return this.location;
    }

    getHarwareID() {
        return this.hardwareId;
    }

    getLocationArea() {
        return this.location_area;
    }

    getTags() {
        return this.tags.slice();
    }

}
