import './index.scss';
import './index.hbs';

/*example slider from : https://www.youtube.com/watch?v=YxMtL6lJbZw&ab_channel=FrontendTips*/
class Slider {
    trackContainer: HTMLElement;
    track: HTMLElement;
    initialPositionMouseX: number;
    isMoving: boolean;
    marginLeftContainer: number;
    transformValue: number;
    currentPositionMouseXWhenMove: number
    allPositionMouseXWhenMove: Array<number>;

    constructor() {
        this.trackContainer = document.querySelector('.slider-container')! as HTMLElement;
        this.track = document.querySelector('.slider-content-track')! as HTMLElement;
        this.initialPositionMouseX = 0;
        this.transformValue = 0;
        this.marginLeftContainer = this.getMarginLeftFromContainer;
        this.isMoving = false;
        this.currentPositionMouseXWhenMove = 0;
        this.allPositionMouseXWhenMove = [];
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

    mouseDown():any {
        return (event: MouseEvent) => {
            console.log(event)
            this.transformValue = this.getTrackTransformMatrix;
            this.isMoving = true;
            this.initialPositionMouseX = this.getMousePosition(event.pageX);
            this.track.style.transform = `transLateX(${this.transformValue}px)`;
            this.track.classList.add('active');
            console.log(' this.initialPosition', this.initialPositionMouseX);
        }
    }

    mouseMove():any {
        return (event: MouseEvent) => {
            if(!this.isMoving) return;
            this.currentPositionMouseXWhenMove = this.getMousePosition(event.pageX);
            let travelDistanceFromInitialPosition = this.currentPositionMouseXWhenMove - this.initialPositionMouseX;
            this.allPositionMouseXWhenMove.push(this.currentPositionMouseXWhenMove);
            console.log(travelDistanceFromInitialPosition)
            this.checkBoundary(travelDistanceFromInitialPosition);
        }
    }

    mouseUp():any {
        return (event: MouseEvent) => {
            const direction: string = this.direction();
            let timing = 0

            let move = () =>{
                timing = timing + 5;
                console.log('timing', timing);
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

                if(timing < 50) requestAnimationFrame(move);
            }

            if(this.initialPositionMouseX !== this.getMousePosition(event.pageX)) {
                requestAnimationFrame(move);
            }

            this.isMoving = false;
            this.track.classList.remove('active');
        }
    }

    mouseLeave() {
        return () => {
            this.isMoving = false;
            this.track.classList.remove('active');
        }
    }

    init() {
        if(window.PointerEvent) {
            this.track.addEventListener('pointerdown', this.mouseDown());
            this.track.addEventListener('pointermove', this.mouseMove());
            this.track.addEventListener('pointerup', this.mouseUp());
        }else {
            this.track.addEventListener('mousedown', this.mouseDown());
            this.track.addEventListener('mousemove', this.mouseMove());
            this.track.addEventListener('mouseup', this.mouseUp());
            this.track.addEventListener('mouseleave', this.mouseLeave());
        }
    }
}

new Slider().init();