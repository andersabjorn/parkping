import { renderHook, act } from '@testing-library/react-native';
import { useParkingDetector } from '../src/hooks/useParkingDetector';
import { DEV_CONFIG } from '../src/types';

// Mocka alla services
import { sensorService } from '../src/services/SensorService';
jest.mock('../src/services/SensorService');
jest.mock('../src/services/NotificationService');
jest.mock('../src/services/BackgroundService');

describe('useParkingDetector - Happy Path', () => {
  
  it('skall gå från "idle" till "monitoring" när man startar bevakning', async () => {
    (sensorService.requestPermissions as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useParkingDetector(DEV_CONFIG));

    await act(async () => {
      await result.current.startMonitoring();
    });

    expect(result.current.state).toBe('monitoring');
  });
  
  it('skall gå från "monitoring" till "driving" när hastighet ökar', async () => {
    let locationCallback: any;
    let accelerometerCallback: any;
    
    (sensorService.requestPermissions as jest.Mock).mockResolvedValue(true);
    
    (sensorService.startLocationTracking as jest.Mock).mockImplementation((callback) => {
      locationCallback = callback;
    });
    
    (sensorService.startAccelerometer as jest.Mock).mockImplementation((callback) => {
      accelerometerCallback = callback;
    });
    
    const { result } = renderHook(() => useParkingDetector(DEV_CONFIG));
    
    await act(async () => {
      await result.current.startMonitoring();
    });
    
    expect(result.current.state).toBe('monitoring');
    
    // ACT - Skicka accelerometer data
  await act(async () => {
  accelerometerCallback({
    x: 5.0,   // Högre värden
    y: 5.0,
    z: 15.0,  // Detta ger vibration > 1.5
    timestamp: Date.now(),
  });
});
    
    // ACT - Skicka location data
    await act(async () => {
      locationCallback({
        latitude: 59.3293,
        longitude: 18.0686,
        speed: 4.17,
        accuracy: 10,
        timestamp: Date.now(),
      });
    });
    
    expect(result.current.state).toBe('driving');
  });

});