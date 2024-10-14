import { useEffect, useRef } from 'react';

interface MasonryContainerProps {
  children: React.ReactNode[];
}

export const MasonryContainer: React.FC<MasonryContainerProps> = ({
  children,
}: MasonryContainerProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = grid.querySelectorAll('.masonry-item');
    const rowHeight = 10; // 基础行高
    items.forEach((item) => {
      const contentHeight = (item as HTMLElement).offsetHeight;
      const rowSpan = Math.ceil(contentHeight / rowHeight);
      (item as HTMLElement).style.gridRowEnd = `span ${rowSpan}`;
    });
  }, [children]);

  return (
    <div
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gridAutoRows: '10px',
        gap: '8px',
      }}
    >
      {children}
    </div>
  );
};
