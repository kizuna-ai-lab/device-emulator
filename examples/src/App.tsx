import { useEffect, useState } from 'react';
import './App.css'
import deviceEmulatorHelper from './helper';
import DeviceList from './components/DeviceList';
import DevicePreview from './components/DevicePreview';

function App() {
  const [deviceListenerAdded, setDeviceListenerAdded] = useState(false);
  const [deviceType, setDeviceType] = useState<'audioinput' | 'audiooutput' | 'videoinput'>("audioinput");
  const [currentDevice, setCurrentDevice] = useState<MediaDeviceInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [meta, setMeta] = useState<EmulatedDeviceMetaProps | null>(null);
  const [customDeviceId, setCustomDeviceId] = useState<string>('');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [customGroupId, setCustomGroupId] = useState<string>('');
  const [useCustomValues, setUseCustomValues] = useState<boolean>(false);
  const [groupIds, setGroupIds] = useState<string[]>([]);

  useEffect(() => {
    if(deviceListenerAdded){
      return;
    }
    navigator.mediaDevices.addEventListener("devicechange", () => {
      updateDevices();
    });
    setDeviceListenerAdded(true);
  }, [deviceListenerAdded]);

  const updateMeta = () => {
    if (!currentDevice || !deviceEmulatorHelper.isVirtualDevice(currentDevice)){
      setMeta(null);
      return;
    };
    const newMeta = deviceEmulatorHelper.getDeviceMeta(currentDevice.deviceId);
    if(newMeta){
      setMeta({...newMeta});
    } else {
      setMeta(null);
    }
  };

  useEffect(() => {
    updateMeta();
  }, [currentDevice]);

  const updateGroupIds = async () => {
    try {
      const ids = await deviceEmulatorHelper.getEmulatedGroupIds();
      setGroupIds(ids);
    } catch (error) {
      console.error('Failed to get group IDs:', error);
    }
  };

  const updateDevices = async () => {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices?.filter(device => device.label?.includes('Emulated device of'));
    setDevices(devices);
    await updateGroupIds();
  };

  const addDevice = async () => {
    try {
      let newDeviceId: string;
      
      if (useCustomValues && (customDeviceId || customLabel || customGroupId)) {
        // Check if device already exists
        if (customDeviceId && deviceEmulatorHelper.deviceExists(customDeviceId)) {
          alert(`Device with ID "${customDeviceId}" already exists!`);
          return;
        }
        
        newDeviceId = (deviceEmulatorHelper.addDevice as any)(
          deviceType, 
          undefined, // capabilities
          {
            deviceId: customDeviceId || undefined,
            label: customLabel || undefined,
            groupId: customGroupId || undefined
          }
        );
      } else {
        newDeviceId = deviceEmulatorHelper.addDevice(deviceType);
      }

      if(!currentDevice){
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const newDevice = allDevices.find((d) => d.deviceId === newDeviceId);
        if (newDevice) {
          setCurrentDevice(newDevice);
        }
      }

      // Clear custom inputs after successful addition
      if (useCustomValues) {
        setCustomDeviceId('');
        setCustomLabel('');
        setCustomGroupId('');
      }
    } catch (error) {
      alert(`Failed to add device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteDevice = async () => {
    if (!currentDevice) return;
    deviceEmulatorHelper.removeDevice(currentDevice.deviceId);
    setCurrentDevice(null);
  };

  const toggleSilence = () => {
    if (!currentDevice) return;
    deviceEmulatorHelper.toggleSilence(currentDevice.deviceId);
    updateMeta();
  };

  const toggleFailDevice = () => {
    if (!currentDevice) return;
    deviceEmulatorHelper.toggleFailDevice(currentDevice.deviceId);
    updateMeta();
  };

  const updateCurrentDevice = (deviceId: string) => {
    const current = devices.find((d) => d.deviceId === deviceId);
    if (current) {
      setCurrentDevice(current);
    }
  };
  

  return (
    <div className="min-h-full w-full space-y-12 content-auto">
      <main>
        <a href="https://dyte.io">
          <img src="https://assets.dyte.io/logo-outlined.png" alt="Logo" width="120" />
        </a>
        <h1 className="text-4xl font-bold text-center">Device Emulator Demo</h1>
        <div className="border-b border-gray-900/10 p-5 flex flex-col gap-4 items-center justify-center">
            <div className="bg-gray-200 border border-gray-200 text-gray-700 flex shadow-sm rounded-md overflow-hidden">
              <select
                className="selector"
                id="device-type"
                onChange={(e) => setDeviceType(e.target.value as "audioinput" | "audiooutput" | "videoinput")}
              >
                <option value="audioinput">Audio input</option>
                <option value="audiooutput">Audio output</option>
                <option value="videoinput">Video input</option>
              </select>
              <button
                className="bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={addDevice}
              >
                Add virtual device
              </button>
            </div>
            
            {/* Custom Device Options */}
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="use-custom"
                  checked={useCustomValues}
                  onChange={(e) => setUseCustomValues(e.target.checked)}
                />
                <label htmlFor="use-custom" className="text-sm font-medium">
                  Use custom device properties
                </label>
              </div>
              
              {useCustomValues && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="custom-id" className="block text-xs font-medium text-gray-700 mb-1">
                      Custom Device ID (optional)
                    </label>
                    <input
                      type="text"
                      id="custom-id"
                      value={customDeviceId}
                      onChange={(e) => setCustomDeviceId(e.target.value)}
                      placeholder="e.g., my-custom-device-123"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-label" className="block text-xs font-medium text-gray-700 mb-1">
                      Custom Label (optional)
                    </label>
                    <input
                      type="text"
                      id="custom-label"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="e.g., My Custom Camera"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-group-id" className="block text-xs font-medium text-gray-700 mb-1">
                      Custom Group ID (optional)
                    </label>
                    <input
                      type="text"
                      id="custom-group-id"
                      value={customGroupId}
                      onChange={(e) => setCustomGroupId(e.target.value)}
                      placeholder="e.g., my-device-group"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Group IDs Display */}
            {groupIds.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Current Group IDs:</h4>
                <div className="flex flex-wrap gap-2">
                  {groupIds.map((groupId, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {groupId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div
            className="grid grid-cols-2 gap-4 mt-5 p-10"
            style={{gridTemplateRows: "auto 1fr"}}
          >
            <div className="flex">
              <DeviceList
                devices={devices}
                currentDevice={currentDevice || null}
                previewDevice={(deviceId) => updateCurrentDevice(deviceId)}
              />
            </div>
            <div className="flex" id="preview-screen">
              {currentDevice && (
                <DevicePreview
                  device={currentDevice}
                  meta={meta}
                  onSilenceToggle={toggleSilence}
                  onFailToggle={toggleFailDevice}
                  onDelete={deleteDevice} 
                />
              )}
              {(devices?.length && !currentDevice) ? (
                <div className="flex flex-col">
                  <h3 className="pl-3">
                    Please select a device from the device list to preview.
                  </h3>
                </div>
              ): ''}
            </div>
          </div>

      </main>
    </div>
  );
}

export default App
