import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import { clamp } from '../utils';

export function distanceRect(x, y, rect) {
    var dx = x - clamp(x, rect.left, rect.right);
    var dy = y - clamp(y, rect.top, rect.bottom);

    return Math.sqrt(dx * dx + dy * dy);
}

export function closestRect(x, y, containers) {
    var distances = containers.map(function (c) {
        return distanceRect(x, y, c.getBoundingClientRect());
    });
    return distances.indexOf(Math.min.apply(Math, _toConsumableArray(distances)));
}

export function getDelta(rect1, rect2) {
    return {
        x: rect1.left - rect2.left,
        y: rect1.top - rect2.top
    };
}

export function updateDistanceBetweenContainers(distance, container1, container2) {
    var x = distance.x,
        y = distance.y;

    var d = getDelta.apply(undefined, _toConsumableArray([container1, container2].map(function (c) {
        return c.container.getBoundingClientRect();
    })));
    var scrollDX = container2.scrollContainer.scrollLeft - container1.scrollContainer.scrollLeft;
    var scrollDY = container2.scrollContainer.scrollTop - container1.scrollContainer.scrollTop;
    return {
        x: x + d.x + scrollDX,
        y: y + d.y + scrollDY
    };
}