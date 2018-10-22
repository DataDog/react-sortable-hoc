import {limit} from '../utils';

export function distanceRect(x, y, rect) {
  // Take account of scroll
  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;

  const left = rect.left + pageXOffset;
  const right = rect.right + pageXOffset;
  const top = rect.top + pageYOffset;
  const bottom = rect.bottom + pageYOffset;
  const dx = x - limit(left, right, x);
  const dy = y - limit(top, bottom, y);
  return Math.sqrt(dx * dx + dy * dy);
}

export function closestRect(x, y, containers) {
  const distances = containers.map(c =>
    distanceRect(x, y, c.getBoundingClientRect()));
  return distances.indexOf(Math.min(...distances));
}

export function getDelta(rect1, rect2) {
  return {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top,
  };
}

export function updateDistanceBetweenContainers(
  distance,
  container1,
  container2,
) {
  const {x, y} = distance;
  const d = getDelta(
    ...[container1, container2].map(c => c.container.getBoundingClientRect()),
  );
  const scrollDX = container2.scrollContainer.scrollLeft - container1.scrollContainer.scrollLeft;
  const scrollDY = container2.scrollContainer.scrollTop - container1.scrollContainer.scrollTop;
  return {
    x: x + d.x + scrollDX,
    y: y + d.y + scrollDY,
  };
}
