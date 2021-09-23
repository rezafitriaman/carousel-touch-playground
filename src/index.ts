import './index.scss';
import './index.hbs';

/*example slider from : https://www.youtube.com/watch?v=YxMtL6lJbZw&ab_channel=FrontendTips*/
//const trackContainer = document.querySelector('.slider-container')! as HTMLElement;
//const track = document.querySelector('.slider-content-track')! as HTMLElement;
//let initialPosition = 0;
//let moving = false;
//let transformValue = 0;
//let inter:any = null;

/*track.addEventListener('mousedown', (event : Event)=> {
    console.log('mouse down');
    //clearInterval(inter);
    initialPosition = (event as MouseEvent).pageX - 16;

    moving = true;

    const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
    if(transformMatrix !== 'none') {
        transformValue = parseInt(transformMatrix.split(',')[4].trim());
        console.log('transformValue', transformValue)
        track.style.transform = `transLateX(${transformValue}px)`;
    }
    track.classList.add('active');
})

track.addEventListener('mousemove', (event : Event)=> {
    if(!moving) return;
    console.log('mouse move');
    const currentPosition = (event as MouseEvent).pageX - 16;
    const diff = currentPosition - initialPosition;
    checkBoundary(diff);
})

track.addEventListener('mouseup', ()=> {
    console.log('mouse up');
    moving = false;
    track.classList.remove('active');

    const currentPosition = (event as MouseEvent).pageX - 16;
    const diff = currentPosition - initialPosition;
    console.log('diff mouse up', diff)

    let transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
    if(transfothis.initialPositionrmMatrix !== 'none') {
        transformValue = parseInt(transformMatrix.split(',')[4].trim());
        console.log('transformValue mouse up', transformValue)
        let init = 50;
        let number = 0;

        let move = (timmy:any)=> {
            init = init + 50

            console.log('timmy', timmy - number)
            console.log('number', number)
            number = timmy

            if(diff < 0) {
                console.log('to right');
                track.style.transform = `transLateX(${transformValue + -init}px)`;

                if((transformValue + -init ) < -(track.scrollWidth - trackContainer.offsetWidth)) {
                    console.log('yes');
                    track.style.transform = `transLateX(${-(track.scrollWidth - trackContainer.offsetWidth)}px)`;
                }
            }else {
                console.log('to left');
                track.style.transform = `transLateX(${transformValue + init}px)`;
                console.log('with init', transformValue + init);
                if(transformValue + init > 0) {
                    track.style.transform = `transLateX(${0}px)`;
                }
            }
            if(init < 800) {
                requestAnimationFrame(move);
            }
            console.log('init', init);
        }

        window.requestAnimationFrame(move);



        // TODO change this to request animation
        /!*inter = setInterval(()=> {
            if(diff < 0) {
                console.log('to right');
                track.style.transform = `transLateX(${transformValue + -init}px)`;

                if((transformValue + -init ) < -(track.scrollWidth - trackContainer.offsetWidth)) {
                    console.log('yes');
                    track.style.transform = `transLateX(${-(track.scrollWidth - trackContainer.offsetWidth)}px)`;
                }
            }else {
                console.log('to left');
                track.style.transform = `transLateX(${transformValue + init}px)`;
                console.log('with init', transformValue + init);
               if(transformValue + init > 0) {
                   track.style.transform = `transLateX(${0}px)`;
               }
            }

            if(init > 800) {
                clearInterval(inter);
            }
            init = init + 10
        }, 5);*!/
    }


})


track.addEventListener('mouseleave', ()=> {
    console.log('mouse leave');
    moving = false;
    track.classList.add('remove');
})

const checkBoundary = (diff: number) => {
    if(transformValue + diff > 0) {
        track.style.transform = `transLateX(${0}px)`;
    }else {
        track.style.transform = `transLateX(${transformValue + diff}px)`;
    }

    if((transformValue + diff ) < -(track.scrollWidth - trackContainer.offsetWidth)) {
        track.style.transform = `transLateX(${-(track.scrollWidth - trackContainer.offsetWidth)}px)`;
    }
}*/


/*TODO add mobile version*/


//TODO change to ts

class Slider {
    trackContainer: HTMLElement;
    track: HTMLElement;
    initialPositionMouseX: number;
    isMoving: boolean;
    marginLeftContainer: number;
    transformValue: number;
    currentPositionMouseXWhenMove: number
    allPositionMouseXWhenMove: Array<number>;
    //animationTiming: number;
    //travelDistanceFromInitialPosition: number;

    constructor() {
        this.trackContainer = document.querySelector('.slider-container')! as HTMLElement;
        this.track = document.querySelector('.slider-content-track')! as HTMLElement;
        this.initialPositionMouseX = 0;
        this.transformValue = 0;
        this.marginLeftContainer = this.getMarginLeftFromContainer;
        this.isMoving = false;
        this.currentPositionMouseXWhenMove = 0;
        this.allPositionMouseXWhenMove = [];
        //this.animationTiming = 50;
        //this.travelDistanceFromInitialPosition = 0;
    }

    get getMarginLeftFromContainer() {
        const style = getComputedStyle(this.trackContainer);
        const itemTopMargin = style.marginLeft;

        return parseInt(itemTopMargin);
    }

    get getTrackTransformMatrix() {
        let transFormStyle = getComputedStyle(this.track).getPropertyValue('transform');
        let value = (transFormStyle !== 'none') ? parseInt(transFormStyle.split(',')[4].trim()) : 0;

        return value;
    }

    getMousePosition(pageX: number) {
        return pageX - this.marginLeftContainer;
    }

    checkBoundary(travelDistanceFromInitialPosition: number) {
        let endOfLeftEdge = this.transformValue + travelDistanceFromInitialPosition > 0;
        let endOfRightEdge = (this.transformValue + travelDistanceFromInitialPosition ) < -(this.track.scrollWidth - this.trackContainer.offsetWidth);

        if(endOfLeftEdge) {
            this.track.style.transform = `transLateX(${0}px)`;
        }else if(endOfRightEdge) {
            this.track.style.transform = `transLateX(${-(this.track.scrollWidth - this.trackContainer.offsetWidth)}px)`;
        } else {
            this.track.style.transform = `transLateX(${this.transformValue + travelDistanceFromInitialPosition}px)`;
        }
    }

    direction(): string {
        const lastPositionMouseXWhenMove = this.allPositionMouseXWhenMove.pop() as number;
        const previousPositionMouseXWhenMove = this.allPositionMouseXWhenMove[this.allPositionMouseXWhenMove.length - 2]

        return (lastPositionMouseXWhenMove < previousPositionMouseXWhenMove) ? 'right' : 'left';
    }

    mouseDown() {
        return (event: MouseEvent) => {
            this.transformValue = this.getTrackTransformMatrix;
            this.isMoving = true;
            this.initialPositionMouseX = this.getMousePosition(event.pageX);
            this.track.style.transform = `transLateX(${this.transformValue}px)`;
            this.track.classList.add('active');
            console.log(' this.initialPosition', this.initialPositionMouseX);
        }
    }

    mouseMove() {
        return (event: MouseEvent) => {
            if(!this.isMoving) return;
            this.currentPositionMouseXWhenMove = this.getMousePosition(event.pageX);
            let travelDistanceFromInitialPosition = this.currentPositionMouseXWhenMove - this.initialPositionMouseX;
            this.allPositionMouseXWhenMove.push(this.currentPositionMouseXWhenMove);
            this.checkBoundary(travelDistanceFromInitialPosition);
        }
    }

    mouseUp() {
        return (event: MouseEvent) => {
            console.log('mouseUp');
            console.log('event', event);
            const direction: string = this.direction();

            console.log('getTrackTransformMatrix', this.getTrackTransformMatrix);
            let timing = 0

            let move = () =>{
                timing = timing + 5;
                console.log(timing);
                console.log('direction', direction);

                if(direction === 'left') {
                    this.track.style.transform = `transLateX(${this.getTrackTransformMatrix + timing}px)`;

                    if(this.getTrackTransformMatrix + timing > 0) {
                        this.track.style.transform = `transLateX(${0}px)`;
                    }
                }

                if(direction === 'right') {
                    this.track.style.transform = `transLateX(${this.getTrackTransformMatrix + -timing}px)`;

                    if((this.getTrackTransformMatrix + -timing) < -(this.track.scrollWidth - this.trackContainer.offsetWidth)) {
                        this.track.style.transform = `transLateX(${-(this.track.scrollWidth - this.trackContainer.offsetWidth)}px)`;
                    }
                }


                if(timing < 80) requestAnimationFrame(move);
            }

            requestAnimationFrame(move);

            this.isMoving = false;
            this.track.classList.remove('active');

        }
    }

    mouseLeave() {
        return (event: MouseEvent) => {
            this.isMoving = false;
            this.track.classList.remove('active');
            console.log('mouseLeave');
            console.log(event);
        }
    }

    init() {
        this.track.addEventListener('mousedown', this.mouseDown());
        this.track.addEventListener('mousemove', this.mouseMove());
        this.track.addEventListener('mouseup', this.mouseUp());
        this.track.addEventListener('mouseleave', this.mouseUp());
    }
}

new Slider().init();