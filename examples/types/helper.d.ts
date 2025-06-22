declare class DeviceEmulatorHelper {
    addDevice(
        kind: 'videoinput',
        capabilities?: MediaTrackCapabilities,
        options?: {
            deviceId?: string;
            label?: string;
            groupId?: string;
            stream?: MediaStream;
        }
    ): string;

    removeDevice(deviceId: string): boolean;
    toggleSilence(deviceId: string): boolean | undefined;
    toggleFailDevice(deviceId: string): boolean | undefined;
    getDeviceMeta(deviceId: string): any;
    isVirtualDevice(device: MediaDeviceInfo): boolean;
    deviceExists(deviceId: string): boolean;
    getEmulatedDevices(): Promise<MediaDeviceInfo[]>;
    getDevicesByGroupId(groupId: string): Promise<MediaDeviceInfo[]>;
    getEmulatedGroupIds(): Promise<string[]>;
}
declare const _default: DeviceEmulatorHelper;
export default _default;
