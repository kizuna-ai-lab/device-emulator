declare global {
    type EmulatedAudioDeviceCapabilities = Record<string, never>;
    interface EmulatedVideoDeviceCapabilities {
        height?: {
            max?: number;
        };
        width?: {
            max?: number;
        };
        frameRate?: {
            max?: number;
        };
        facingMode?: string[];
    }
    interface EmulatedDeviceMetaProps {
        tracks: MediaStreamTrack[];
        fail: boolean;
        silent: boolean;
        device: MediaDeviceInfo;
        eventTarget: EventTarget;
        customStream?: MediaStream;
    }
    type EmulatedDeviceMeta = Record<string, EmulatedDeviceMetaProps | undefined>;
    interface EmulatedDeviceOptions {
        deviceId?: string;
        label?: string;
        groupId?: string;
        stream?: MediaStream;
    }
    interface MediaDevices {
        meta?: EmulatedDeviceMeta;
        emulatedAudioDeviceCapabilities: MediaTrackCapabilities;
        emulatedVideoDeviceCapabilities: MediaTrackCapabilities;
        removeEmulatedDevice(emulatorDeviceId: string): boolean;
        silenceDevice(emulatorDeviceId: string, silent: boolean): boolean;
        failDevice(emulatorDeviceId: string, fail: boolean): boolean;
        addEmulatedDevice(kind: 'audiooutput', capabilities?: undefined, options?: EmulatedDeviceOptions): string;
        addEmulatedDevice(kind: 'audioinput', capabilities?: EmulatedAudioDeviceCapabilities, options?: EmulatedDeviceOptions): string;
        addEmulatedDevice(kind: 'videoinput', capabilities?: EmulatedVideoDeviceCapabilities, options?: EmulatedDeviceOptions): string;
    }
    interface InputDeviceInfo {
        getCapabilities(): MediaTrackCapabilities;
    }
    interface HTMLMediaElement {
        sinkId: string;
        setSinkId(sinkId: string): Promise<void>;
    }
    interface LegacyMediaTrackConstraints {
        sourceId?: string;
    }
    interface MediaTrackConstraints {
        optional?: LegacyMediaTrackConstraints | LegacyMediaTrackConstraints[];
        mandatory?: LegacyMediaTrackConstraints | LegacyMediaTrackConstraints[];
    }
}
export {};
