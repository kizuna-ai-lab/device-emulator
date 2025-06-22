function createAudioStream(props: EmulatedDeviceMetaProps) {
    // If custom stream exists, prioritize using the custom stream
    if (props.customStream) {
        const audioTracks = props.customStream.getAudioTracks();
        if (audioTracks.length > 0) {
            // Create new MediaStream containing only audio tracks
            return new MediaStream(audioTracks);
        }
    }

    // Otherwise use default oscillator audio stream
    const ctx = new AudioContext();
    const osc = new OscillatorNode(ctx);
    const gain = new GainNode(ctx, { gain: +!props.silent });
    const dest = new MediaStreamAudioDestinationNode(ctx);

    osc.connect(gain);
    gain.connect(dest);
    osc.start();

    props.eventTarget.addEventListener('toggleSilence', () => {
        gain.gain.value = +!props.silent;
    });

    return dest.stream;
}

export default createAudioStream;
