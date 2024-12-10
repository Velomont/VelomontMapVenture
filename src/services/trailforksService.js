import L from 'leaflet';
import 'polyline-encoded';
import 'leaflet-geometryutil';

const trailforksService = {
  bikeTrailsLayer: null,
  otherTrailsLayer: null,

  renderTrailforksLayers(map, bikeTrails, otherTrails) {
    this.clearTrailforksLayers(map);

    this.bikeTrailsLayer = L.layerGroup().addTo(map);
    this.otherTrailsLayer = L.layerGroup().addTo(map);

    this.renderTrails(map, bikeTrails, this.bikeTrailsLayer, true);
    this.renderTrails(map, otherTrails, this.otherTrailsLayer, false);
  },

  renderTrails(map, trails, layer, isBikeTrail) {
    if (!map) {
      console.error('Map object is undefined');
      return;
    }

    const currentZoom = map.getZoom();
    const visibleBounds = map.getBounds();

    trails.forEach(trail => {
      if (!trail.encodedPath) return;

      // Skip chairlifts and gondolas
      if (trail.difficulty === '12' || parseInt(trail.activitytype) === 11) return;

      const decodedPath = L.Polyline.fromEncoded(trail.encodedPath).getLatLngs();
      const isVisible = decodedPath.some(point => visibleBounds.contains(point));

      if (isVisible && currentZoom >= 10) {
        const visiblePath = this.getVisiblePortion(decodedPath, visibleBounds);

        const polyline = L.polyline(visiblePath, {
          color: this.getTrailColor(trail.activitytype, trail.difficulty),
          weight: isBikeTrail ? 3 : 1,
          opacity: isBikeTrail ? 0.8 : 0.6,
          dashArray: this.getTrailDashArray(trail.activitytype)
        }).addTo(layer);

        polyline.on('click', (e) => {
          const closestPoint = L.GeometryUtil.closest(map, polyline.getLatLngs(), e.latlng);
          const popup = L.popup()
            .setLatLng(closestPoint)
            .setContent(this.getPopupContent(trail));
          map.openPopup(popup);
        });
      }
    });
  },

  getVisiblePortion(path, bounds) {
    const extendedBounds = bounds.pad(0.1);
    return path.filter(point => extendedBounds.contains(point));
  },
        
  getTrailColor(activitytype, difficulty) {
    const colors = {
      mountainBike: '#475945',    // Orange
      multiUse: '#538843',        // Blue
      roadBike: '#474747',        // Red
      gravelBike: '#CA9460',      // Purple
      otherBike: '#1abc9c',       // Turquoise
      motorized: '#F2A634',       // Yellow
      nonMotorizedNonBike: '#64A064', // Green
      chairliftGondola: '#95a5a6' // Gray (though we're filtering these out)
    };
    

    const activityType = parseInt(activitytype);
    const difficultyLevel = parseInt(difficulty);

    if (activityType === 0) { // Multi-Use
      if (difficultyLevel === 12) {
        return colors.chairliftGondola;
      } else {
        return colors.multiUse;
      }
    }

    switch (activityType) {
      case 1:
        return colors.mountainBike;
      case 3:
        return colors.roadBike;
      case 19:
        return colors.gravelBike;
      case 2:
      case 17:
      case 18:
        return colors.otherBike;
      case 7:
      case 8:
      case 14:
      case 15:
        return colors.motorized;
      default:
        return colors.nonMotorizedNonBike;
    }
  },

    getTrailDashArray(activitytype) {
      const activityType = parseInt(activitytype);

      // Multi-use trails (activitytype = 0)
      if (activityType === 0) {
        return '5, 5'; // Dashed line for multi-use trails
      }

      // Biking trails (solid line)
      if (activityType === 1 || activityType === 2 || activityType === 3 || activityType === 17 || activityType === 18 || activityType === 19) {
        return null;
      }

      // Non-biking trails (dotted line)
      return '0.5, 4';
    },

        getPopupContent(trail) {
          return `
            <h3>${trail.title}</h3>
            <p>Activity: ${this.getActivityTypeText(trail.activitytype)}</p>
            <p>Difficulty: ${this.getDifficultyText(trail.difficulty)}</p>
            <p>Status: ${this.getStatusText(trail.status)}</p>
            <p>Condition: ${this.getConditionText(trail.condition)}</p>
            <p>Direction: ${this.getDirectionText(trail.direction)}</p>
          `;
        },




  getDifficultyText(difficulty) {
    const difficultyTexts = {
      '1': 'Easy',
      '2': 'Intermediate',
      '3': 'Advanced',
      '4': 'Expert',
      '5': 'Pro',
      '12': 'Chairlift/Gondola'
    };
    return difficultyTexts[difficulty] || 'Unknown';
  },

  getStatusText(status) {
    const statusTexts = {
      '1': 'Open',
      '2': 'Closed',
      '3': 'Caution'
    };
    return statusTexts[status] || 'Unknown';
  },

  getConditionText(condition) {
    const conditionTexts = {
      '1': 'Unknown',
      '2': 'Minor Issues',
      '3': 'Poor',
      '4': 'Very Poor',
      '5': 'Good',
      '6': 'Very Good',
      '7': 'Fair',
      '8': 'Variable',
      '9': 'Snowy',
      '10': 'Icy',
      '11': 'Tacky'
    };
    return conditionTexts[condition] || 'Unknown';
  },

  getDirectionText(direction) {
    const directionTexts = {
      '1': 'Both',
      '2': 'Downhill',
      '3': 'Uphill',
      '4': 'Preferred Downhill',
      '5': 'Preferred Uphill'
    };
    return directionTexts[direction] || 'Unknown';
  },

  getActivityTypeText(activitytype) {
    const activityTexts = {
      '0': 'Multi-Use',
      '1': 'Mountain Bike',
      '2': 'E-Bike',
      '3': 'Road Bike',
      '4': 'Run/Walk',
      '5': 'Trail Running',
      '6': 'Hike',
      '7': 'Dirtbike/Moto',
      '8': 'ATV/ORV/OHV',
      '9': 'Horse',
      '10': 'Snowshoe',
      '11': 'Downhill Ski',
      '12': 'Backcountry Ski',
      '13': 'Nordic Ski',
      '14': 'Observed Trials',
      '15': 'Snowmobile',
      '16': 'Snowboard',
      '17': 'Winter Fat Bike',
      '18': 'Adaptive Bike',
      '19': 'Gravel Bike',
      '20': 'Onewheel',
      '99': 'Other'
    };
    return activityTexts[activitytype] || 'Unknown';
  },

fitMapToTrails(map, bikeTrails, otherTrails) {
    const allTrails = [...bikeTrails, ...otherTrails];
    if (allTrails.length === 0) return;

    const bounds = L.latLngBounds();
    allTrails.forEach(trail => {
      if (trail.latitude && trail.longitude) {
        bounds.extend([parseFloat(trail.latitude), parseFloat(trail.longitude)]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  },

  clearTrailforksLayers(map) {
    if (this.bikeTrailsLayer) {
      map.removeLayer(this.bikeTrailsLayer);
      this.bikeTrailsLayer = null;
    }
    if (this.otherTrailsLayer) {
      map.removeLayer(this.otherTrailsLayer);
      this.otherTrailsLayer = null;
    }
  }
};

export default trailforksService;