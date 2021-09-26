type Direction = "left" | "right"

export default class Slider {
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

    get getMarginLeftFromContainer(): number {
        const style = getComputedStyle(this.trackContainer);
        const itemTopMargin = style.marginLeft;

        return parseInt(itemTopMargin);
    }

    get getTrackTransformMatrix():number {
        let transFormStyle = getComputedStyle(this.track).getPropertyValue('transform');
        let value = (transFormStyle !== 'none') ? parseInt(transFormStyle.split(',')[4].trim()) : 0;

        return value;
    }

    getMousePosition(pageX: number):number {
        return pageX - this.marginLeftContainer;
    }

    checkBoundary(travelDistanceFromInitialPosition: number):void {
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

    direction(): Direction {
        const lastPositionMouseXWhenMove = this.allPositionMouseXWhenMove.pop() as number;
        const previousPositionMouseXWhenMove = this.allPositionMouseXWhenMove[this.allPositionMouseXWhenMove.length - 2]

        return (lastPositionMouseXWhenMove < previousPositionMouseXWhenMove) ? 'right' : 'left';
    }

    movingOrNot(moving: boolean) {
        this.isMoving = moving;

        if(moving) {
            this.track.classList.add('active');
        }else {
            this.track.classList.remove('active');
        }
    }

    mouseDown() {
        return (event: MouseEvent) => {
            this.transformValue = this.getTrackTransformMatrix;
            this.initialPositionMouseX = this.getMousePosition(event.pageX);
            this.track.style.transform = `transLateX(${this.transformValue}px)`;
            this.movingOrNot(true);
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
            const direction: Direction= this.direction();
            let timing = 0

            let move = () => {
                timing = timing + 5;

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

            this.movingOrNot(false);
        }
    }

    mouseLeave() {
        return () => {
            this.movingOrNot(false);
        }
    }

    init() {
        this.track.addEventListener('pointerdown', this.mouseDown());
        this.track.addEventListener('pointermove', this.mouseMove());
        this.track.addEventListener('pointerup', this.mouseUp());
        this.track.addEventListener('pointerleave', this.mouseLeave());
    }
}