import React from 'react';
import ImageRenderer from './image';

export default class VideoRenderer extends ImageRenderer {
    get croppedMedia() {
        const { media } = this.props;
        // stop video
        media.pause();
        // set video time to start
        media.currentTime = 0;
        media.playbackRate = 10;
        // turn off looping
        media.loop = false;
        // create mediastream from canvas
        const mediaRecorder = new MediaRecorder(
            this.refs.canvas.captureStream(30),
            {
                mimeType: 'video/webm',
                videoBitsPerSecond: 2500000
            }
        );
        // play the full video
        mediaRecorder.start();
        media.play();
        media.onended = () => {
            // stop the recorder
            mediaRecorder.stop();
        }
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };
        // once video ends, return the recording
        return new Promise(resolve => {
            mediaRecorder.onstop = () => {
                resolve({blob: new Blob(chunks, {type: 'video/webm'}), fileName: 'video.webm'});
            }
        });
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
        const render = () => {
            this.renderCanvas();
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render);
    }

    // TODO: add controls for video
}
