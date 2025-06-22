class DeviceEmulatorHelper {
    addDevice(
        kind: 'audioinput' | 'audiooutput' | 'videoinput',
        capabilities?: MediaTrackCapabilities,
        options?: {
            deviceId?: string;
            label?: string;
            groupId?: string;
            stream?: MediaStream;
        }
    ): string {
        return navigator.mediaDevices.addEmulatedDevice(kind as any, capabilities as any, options);
    }

    removeDevice(deviceId: string) {
        return navigator.mediaDevices.removeEmulatedDevice(deviceId);
    }

    toggleSilence(deviceId: string) {
        const meta = this.getDeviceMeta(deviceId);
        if (meta) {
            return navigator.mediaDevices.silenceDevice(deviceId, !meta.silent);
        }
    }

    toggleFailDevice(deviceId: string) {
        const meta = this.getDeviceMeta(deviceId);
        if (meta) {
            return navigator.mediaDevices.failDevice(deviceId, !meta.fail);
        }
    }

    getDeviceMeta(deviceId: string) {
        return navigator.mediaDevices.meta ? navigator.mediaDevices.meta[deviceId] : undefined;
    }

    isVirtualDevice(device: MediaDeviceInfo) {
        return navigator.mediaDevices.meta !== undefined 
            && navigator.mediaDevices.meta[device.deviceId] !== undefined
            && device.label.startsWith('Emulated device of');
    }

    /**
     * Check if a device with the given ID already exists
     */
    deviceExists(deviceId: string): boolean {
        return navigator.mediaDevices.meta !== undefined && 
               navigator.mediaDevices.meta[deviceId] !== undefined;
    }

    /**
     * Get all emulated devices
     */
    async getEmulatedDevices(): Promise<MediaDeviceInfo[]> {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => this.isVirtualDevice(device));
    }

    /**
     * Get devices by group ID
     */
    async getDevicesByGroupId(groupId: string): Promise<MediaDeviceInfo[]> {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => 
            this.isVirtualDevice(device) && device.groupId === groupId
        );
    }

    /**
     * Get all unique group IDs
     */
    async getEmulatedGroupIds(): Promise<string[]> {
        const devices = await this.getEmulatedDevices();
        const groupIds = devices.map(device => device.groupId);
        return [...new Set(groupIds)];
    }
}

export default new DeviceEmulatorHelper();