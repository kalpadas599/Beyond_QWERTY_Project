import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: `${import.meta.env.VITE_API_KEY}`,
});

export const startRecording = async (onTranscriptReceived, setListening, fieldName) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        let chunks = [];

        recorder.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/mp3" });

            const params = {
                audio: audioBlob,
            };

            try {
                const transcript = await client.transcripts.transcribe(params);

                if (transcript.status === "error") {
                    console.error("Transcription error:", transcript.error);
                } else {
                    let cleanedText;

                    if (fieldName === "email") {
                        // Remove spaces and commas but allow full stops except at the end
                        cleanedText = transcript.text.replace(/[\s,]/g, "").replace(/\.+$/, "");
                    } else {
                        // Remove spaces, commas, and full stops entirely for other fields
                        cleanedText = transcript.text.replace(/[.,\s]/g, "");
                    }

                    onTranscriptReceived(cleanedText);
                }
            } catch (err) {
                console.error("Error in transcription:", err);
            }

            setListening(false);
        };

        recorder.start();
        setListening(true);

        return recorder;
    } catch (err) {
        console.error("Error accessing microphone:", err);
        return null;
    }
};

export const stopRecording = (recorder) => {
    if (recorder) {
        recorder.stop();
    }
};
