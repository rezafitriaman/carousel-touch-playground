import './index.scss';
import './index.hbs';

/*example slider from : https://www.youtube.com/watch?v=YxMtL6lJbZw&ab_channel=FrontendTips*/
const track = document.querySelector('.slider-content-track')! as HTMLElement;
let initialPosition = 0;
let moving = false;
let transformValue = 0;

track.addEventListener('mousedown', (event : Event)=> {
    console.log('mouse down');
    initialPosition = (event as MouseEvent).pageX - 16;
    moving = true;
    const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
    console.log(initialPosition);
    console.log('transformMatrix', transformMatrix);
    if(transformMatrix !== 'none') {
        transformValue = parseInt(transformMatrix.split(',')[4].trim());
        console.log('transformValue', transformValue)
        track.style.transform = `transLateX(${transformValue}px)`;
    }

})

track.addEventListener('mousemove', (event : Event)=> {
    if(!moving) return;
    console.log('mouse move');
    console.log(moving)
    const currentPosition = (event as MouseEvent).pageX - 16;
    const diff = currentPosition - initialPosition;
    console.log(diff)

    track.style.transform = `transLateX(${transformValue + diff}px)`;
})

track.addEventListener('mouseup', ()=> {
    console.log('mouse up');
    moving = false;
})

track.addEventListener('mouseleave', ()=> {
    console.log('mouse leave');
    moving = false;
})

/*TODO add mobile version*/
