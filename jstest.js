function SW() {
    let startTime, endTime, running, duration = 0;

    Object.defineProperty(this, 'duration', {get: () => {return duration}});
    
    this.start = () => {
        if (running){throw new Error('Stopwatch Already Running!');}
        else if (!duration) {startTime = new Date(); running = 1; console.log('starting');}
        else {console.log('resuming'); running = 1 ;}
    };
    this.stop = () => {
        if (!running){throw new Error('Stopwatch Not Running!')}
        else {endTime = new Date(); running = 0; duration = endTime.getTime() - startTime.getTime() / 1000; };
    };
    
    this.reset = () => {
        startTime = 0;
        endTime = 0;
        running = 0;
        duration = 0;
    };
    

};

let sw = new SW();