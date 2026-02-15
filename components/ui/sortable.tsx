"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Slot as SlotPrimitive } from "radix-ui";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type MeasuringConfiguration,
  type Modifiers,
  type SensorDescriptor,
  type SensorOptions,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
  type SortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

import { cn } from "@/lib/utils";
import { composeRefs } from "@/lib/compose-refs";

type Orientation = "vertical" | "horizontal" | "mixed";

type SortableRootContext<T> = {
  activeId: UniqueIdentifier | null;
  items: UniqueIdentifier[];
  value: T[];
};

type SortableItemContext = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  ref: ReturnType<typeof useSortable>["setActivatorNodeRef"];
};

const SortableRootContext = React.createContext<SortableRootContext<any> | null>(
  null,
);
const SortableItemContext = React.createContext<SortableItemContext | null>(null);
const SortableOverlayContext = React.createContext(false);

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: rectSortingStrategy,
  },
} as const satisfies Record<
  Orientation,
  {
    modifiers: Modifiers;
    strategy: SortingStrategy;
  }
>;

type SortableProps<T> = {
  value: T[];
  onValueChange: (value: T[]) => void;
  getItemValue?: (item: T) => UniqueIdentifier;
  orientation?: Orientation;
  collisionDetection?: CollisionDetection;
  modifiers?: Modifiers;
  sensors?: SensorDescriptor<SensorOptions>[];
  measuring?: MeasuringConfiguration;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  children: React.ReactNode;
};

function getItemValue<T>(item: T) {
  return item as UniqueIdentifier;
}

function Sortable<T>({
  value,
  onValueChange,
  getItemValue: getItemValueProp,
  orientation = "vertical",
  collisionDetection = closestCenter,
  modifiers,
  sensors,
  measuring,
  onDragStart,
  onDragEnd,
  children,
}: SortableProps<T>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const getValue = getItemValueProp ?? getItemValue;

  const items = React.useMemo(
    () => value.map((item) => getValue(item)),
    [value, getValue],
  );

  const sensorsConfig = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const config = orientationConfig[orientation];

  return (
    <SortableRootContext.Provider value={{ activeId, items, value }}>
      <DndContext
        sensors={sensors ?? sensorsConfig}
        modifiers={modifiers ?? config.modifiers}
        collisionDetection={collisionDetection}
        measuring={measuring}
        onDragStart={(event) => {
          setActiveId(event.active.id);
          onDragStart?.(event);
        }}
        onDragEnd={(event) => {
          if (event.over?.id && event.active.id !== event.over.id) {
            const activeIndex = items.indexOf(event.active.id);
            const overIndex = items.indexOf(event.over.id);
            if (activeIndex !== -1 && overIndex !== -1) {
              onValueChange(arrayMove(value, activeIndex, overIndex));
            }
          }
          setActiveId(null);
          onDragEnd?.(event);
        }}
        onDragCancel={() => {
          setActiveId(null);
        }}
      >
        <SortableContext items={items} strategy={config.strategy}>
          {children}
        </SortableContext>
      </DndContext>
    </SortableRootContext.Provider>
  );
}

type SortableContentProps = React.HTMLAttributes<HTMLDivElement>;

const SortableContent = React.forwardRef<HTMLDivElement, SortableContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props} />
  ),
);
SortableContent.displayName = "SortableContent";

type SortableItemProps = React.ComponentPropsWithoutRef<typeof SlotPrimitive.Slot> & {
  value: UniqueIdentifier;
  asChild?: boolean;
};

function getSortableItemState(
  active: UniqueIdentifier | null,
  over: UniqueIdentifier | null,
  value: UniqueIdentifier,
) {
  if (!active || !over) return "idle";
  if (active === value) return "active";
  if (over === value) return "over";
  return "idle";
}

const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
  ({ value, asChild, ...props }, forwardedRef) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
      over,
      active,
    } = useSortable({ id: value });
    const inSortableOverlay = React.useContext(SortableOverlayContext);
    const dataState = inSortableOverlay
      ? "overlay"
      : getSortableItemState(active?.id ?? null, over?.id ?? null, value);

    const resolvedTransition = isDragging ? "none" : transition;
    const style = {
      transform: CSS.Transform.toString(transform),
      transition: resolvedTransition,
      zIndex: isDragging ? 50 : undefined,
      boxShadow: isDragging
        ? "0 24px 40px -20px rgba(0,0,0,0.45)"
        : undefined,
      ...props.style,
    } as React.CSSProperties;

    return (
      <SortableItemContext.Provider
        value={{ attributes, listeners, ref: setActivatorNodeRef }}
      >
        <SlotPrimitive.Slot
          ref={composeRefs(setNodeRef, forwardedRef)}
          data-state={dataState}
          data-dragging={isDragging}
          style={style}
          {...props}
        />
      </SortableItemContext.Provider>
    );
  },
);
SortableItem.displayName = "SortableItem";

type SortableItemHandleProps = React.ComponentPropsWithoutRef<typeof SlotPrimitive.Slot>;

const SortableItemHandle = React.forwardRef<
  HTMLDivElement,
  SortableItemHandleProps
>(({ className, ...props }, forwardedRef) => {
  const context = React.useContext(SortableItemContext);
  if (!context) {
    throw new Error("SortableItemHandle must be used within SortableItem");
  }

  return (
    <SlotPrimitive.Slot
      ref={composeRefs(context.ref, forwardedRef)}
      className={cn(className)}
      {...context.attributes}
      {...context.listeners}
      {...props}
    />
  );
});
SortableItemHandle.displayName = "SortableItemHandle";

type SortableOverlayProps = React.ComponentPropsWithoutRef<typeof DragOverlay>;

const SortableOverlay = React.forwardRef<HTMLDivElement, SortableOverlayProps>(
  ({ className, dropAnimation, ...props }, forwardedRef) => {
    const { activeId } = useSortableRootContext("SortableOverlay");
    const dropAnimationConfig = dropAnimation ?? {
      sideEffects: defaultDropAnimationSideEffects({
        styles: {
          active: {
            opacity: "0.4",
          },
        },
      }),
    };

    return createPortal(
      <DragOverlay dropAnimation={dropAnimationConfig} {...props}>
        {activeId ? (
          <SortableOverlayContext.Provider value>
            <SlotPrimitive.Slot ref={forwardedRef} className={cn(className)} />
          </SortableOverlayContext.Provider>
        ) : null}
      </DragOverlay>,
      document.body,
    );
  },
);
SortableOverlay.displayName = "SortableOverlay";

function useSortableRootContext(name: string) {
  const context = React.useContext(SortableRootContext);
  if (!context) {
    throw new Error(`${name} must be used within Sortable`);
  }
  return context;
}

function useSortableItemContext(name: string) {
  const context = React.useContext(SortableItemContext);
  if (!context) {
    throw new Error(`${name} must be used within SortableItem`);
  }
  return context;
}

export {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
  useSortableRootContext,
  useSortableItemContext,
};
