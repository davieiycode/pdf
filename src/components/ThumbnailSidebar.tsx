import { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableThumbnailProps {
  id: string;
  actualPageNumber: number;
  isActive: boolean;
  onClick: () => void;
}

function SortableThumbnail({ id, actualPageNumber, isActive, onClick }: SortableThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-4 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <div className={`p-1 rounded-lg border-2 transition-all ${isActive ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:border-white/20'}`}>
        <div className="bg-white rounded overflow-hidden shadow-sm pointer-events-none">
          <Page
            pageNumber={actualPageNumber}
            width={120}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-1 font-medium">
        {actualPageNumber}
      </div>
    </div>
  );
}

interface ThumbnailSidebarProps {
  pdfFile: File | null;
  numPages: number;
  currentPageIndex: number;
  onPageSelect: (index: number) => void;
  pageOrder: number[];
  onReorder: (newOrder: number[]) => void;
}

export default function ThumbnailSidebar({ 
  pdfFile, 
  numPages, 
  currentPageIndex, 
  onPageSelect,
  pageOrder,
  onReorder
}: ThumbnailSidebarProps) {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pageOrder.findIndex(p => String(p) === String(active.id));
      const newIndex = pageOrder.findIndex(p => String(p) === String(over.id));
      const newOrder = arrayMove(pageOrder, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (!pdfFile || numPages === 0) {
    return (
      <div className="w-48 bg-[#1e1e1e] border-r border-[#333] flex items-center justify-center text-sm text-gray-500 shrink-0">
        No PDF loaded
      </div>
    );
  }

  return (
    <div className="w-48 bg-[#1e1e1e] border-r border-[#333] flex flex-col h-full shrink-0">
      <div className="p-3 border-b border-[#333] text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Pages
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pageOrder.map(String)}
            strategy={verticalListSortingStrategy}
          >
            <Document file={pdfFile}>
              {pageOrder.map((actualPageNumber, idx) => (
                <SortableThumbnail
                  key={actualPageNumber}
                  id={actualPageNumber.toString()} // dnd-kit needs string/number IDs. We use actualPageNumber because it's unique.
                  actualPageNumber={actualPageNumber}
                  isActive={currentPageIndex === idx}
                  onClick={() => onPageSelect(idx)}
                />
              ))}
            </Document>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
