import * as React from 'react';

export type Axis = 'x' | 'y' | 'xy';

export type Offset = number | string;

export interface SortStart {
  node: Element;
  index: number;
  collection: Offset;
}

export interface SortOver {
  index: number;
  oldIndex: number;
  newIndex: number;
  collection: Offset;
}

export interface SortEnd {
  oldIndex: number;
  newIndex: number;
  newList: any;
  collection: Offset;
}

export interface SortSwap {
  item: any;
  index: number;
}

export type SortEvent = React.MouseEvent<any> | React.TouchEvent<any>;

export type SortEventWithTag = SortEvent & {
  target: {
    tagName: string;
  };
};

export type SortStartHandler = (sort: SortStart, event: SortEvent) => void;

export type SortMoveHandler = (event: SortEvent) => void;

export type SortEndHandler = (sort: SortEnd, event: SortEvent) => void;

export type SortOverHandler = (sort: SortOver, event: SortEvent) => void;

export type SortSwapHandler = (sort: SortSwap) => void;

export type ContainerGetter = (
  element: React.ReactElement<any>,
) => HTMLElement | Promise<HTMLElement>;

export type HelperContainerGetter = () => HTMLElement;

export interface Dimensions {
  width: number;
  height: number;
}

export class DragLayer {
  addRef: any;
  removeRef: any;
  setTranslateBoundaries: any;
  startDrag: any;
  stopDrag: any;
  handleSortMove: any;
  handleSortEnd: any;
  updatePosition: any;
  updateTargetContainer: any;
}

export interface SortableContainerProps {
  axis?: Axis;
  lockAxis?: Axis;
  helperClass?: string;
  transitionDuration?: number;
  pressDelay?: number;
  pressThreshold?: number;
  distance?: number;
  items?: any;
  shouldCancelStart?: (event: SortEvent | SortEventWithTag) => boolean;
  updateBeforeSortStart?: SortStartHandler;
  onSortStart?: SortStartHandler;
  onSortMove?: SortMoveHandler;
  onSortEnd?: SortEndHandler;
  onSortOver?: SortOverHandler;
  onSortSwap?: SortSwapHandler;
  dragLayer?: DragLayer;
  useDragHandle?: boolean;
  useWindowAsScrollContainer?: boolean;
  hideSortableGhost?: boolean;
  lockToContainerEdges?: boolean;
  lockOffset?: Offset | [Offset, Offset];
  getContainer?: ContainerGetter;
  getHelperDimensions?: (sort: SortStart) => Dimensions;
  helperContainer?: HTMLElement | HelperContainerGetter;
}

export interface SortableElementProps {
  index: number;
  collection?: Offset;
  disabled?: boolean;
}

export interface Config {
  withRef: boolean;
}

export type WrappedComponentFactory<P> = (props: P) => JSX.Element;

export type WrappedComponent<P> =
  | React.ComponentClass<P>
  | WrappedComponentFactory<P>;

export function SortableContainer<P>(
  wrappedComponent: WrappedComponent<P>,
  config?: Config,
): React.ComponentClass<P & SortableContainerProps>;

export function SortableElement<P>(
  wrappedComponent: WrappedComponent<P>,
  config?: Config,
): React.ComponentClass<P & SortableElementProps>;

export function SortableHandle<P>(
  wrappedComponent: WrappedComponent<P>,
  config?: Config,
): React.ComponentClass<P>;

export function arrayMove<T>(
  collection: T[],
  previousIndex: number,
  newIndex: number,
): T[];
