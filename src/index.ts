import './index.scss';
import './index.hbs';

/*example slider from : https://www.youtube.com/watch?v=YxMtL6lJbZw&ab_channel=FrontendTips*/
const trackContainer = document.querySelector('.slider-container')! as HTMLElement;
const track = document.querySelector('.slider-content-track')! as HTMLElement;
let initialPosition = 0;
let moving = false;
let transformValue = 0;

track.addEventListener('mousedown', (event : Event)=> {
    console.log('mouse down');
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
    console.log('transformValue', transformValue)
    const currentPosition = (event as MouseEvent).pageX - 16;
    const diff = currentPosition - initialPosition;
    console.log(diff)

    if(transformValue + diff > 0) {
        track.style.transform = `transLateX(${0}px)`;
    }else {
        track.style.transform = `transLateX(${transformValue + diff}px)`;
    }

    if((transformValue + diff ) < -(track.scrollWidth - trackContainer.offsetWidth)) {
        track.style.transform = `transLateX(${-(track.scrollWidth - trackContainer.offsetWidth)}px)`;
    }
})

track.addEventListener('mouseup', ()=> {
    console.log('mouse up');
    moving = false;
    track.classList.remove('active');
})

track.addEventListener('mouseleave', ()=> {
    console.log('mouse leave');
    moving = false;
    track.classList.add('remove');
})

function checkBoundary() {
    console.log('checkBoundary');
    console.log(window.getComputedStyle(track).getPropertyValue('transform'))
}

checkBoundary();

/*TODO add mobile version*/
