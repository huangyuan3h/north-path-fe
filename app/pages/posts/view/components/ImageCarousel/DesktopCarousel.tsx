import Image from 'next/image';

import styles from './imageCarousel.module.scss';
import clsx from 'clsx';
import { MobileCarousel, MobileCarouselProps } from './MobileCarousel';
import { useWindowWidth } from '@/utils/hooks/useWindowWidth';
import { breakpoints } from '@/utils/breakpoint';
import { getImageUrl } from '@/utils/getImageUrl';

export interface DesktopCarouselProps extends MobileCarouselProps {}

export const DesktopCarousel = ({
  index,
  images,
  onSelect,
  onImageClick,
}: DesktopCarouselProps) => {
  const windowWidth = useWindowWidth();

  if (images.length === 0) {
    return <></>;
  }

  if (windowWidth >= breakpoints.sm && images.length < 3) {
    return (
      <div className={styles.imageLargeSize}>
        <Image
          src={getImageUrl(images[0])}
          alt={`Slide ${1}`}
          width={600}
          height={600}
          loading="lazy"
          className={clsx(styles.carouselImage, styles.showOneImage)}
          onClick={() => onImageClick(1)}
        />
      </div>
    );
  }

  if (windowWidth < breakpoints.md || images.length < 3) {
    return (
      <MobileCarousel
        index={index}
        images={images}
        onSelect={onSelect}
        onImageClick={onImageClick}
      />
    );
  }

  if (windowWidth < breakpoints.lg || images.length < 5) {
    return (
      <div className={clsx(styles.desktopLayoutRow)}>
        <div className={styles.imageLargeSize}>
          <Image
            src={images[0]}
            alt={`Slide ${1}`}
            width={600}
            height={600}
            className={clsx(styles.carouselImage, styles.firstImage)}
            onClick={() => onImageClick(1)}
          />
        </div>

        <div
          className={clsx(styles.desktopLayoutColumn, styles.imageSmallSize)}
        >
          <Image
            src={images[1]}
            alt={`Slide ${2}`}
            width={600}
            height={600}
            className={clsx(styles.carouselImage, styles.lastTopImage)}
            onClick={() => onImageClick(1)}
          />
          <Image
            src={images[2]}
            alt={`Slide ${3}`}
            width={600}
            height={600}
            className={clsx(styles.carouselImage, styles.lastBottomImage)}
            onClick={() => onImageClick(1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.desktopLayoutRow)}>
      <div className={styles.imageLargeSize}>
        <Image
          src={getImageUrl(images[0])}
          alt={`Slide ${1}`}
          width={600}
          height={600}
          loading="lazy"
          className={clsx(styles.carouselImage, styles.firstImage)}
          onClick={() => onImageClick(1)}
        />
      </div>

      <div className={clsx(styles.desktopLayoutColumn, styles.imageSmallSize)}>
        <Image
          src={getImageUrl(images[1])}
          alt={`Slide ${2}`}
          width={600}
          height={600}
          loading="lazy"
          className={clsx(styles.carouselImage)}
          onClick={() => onImageClick(1)}
        />
        <Image
          src={getImageUrl(images[2])}
          alt={`Slide ${3}`}
          width={600}
          height={600}
          loading="lazy"
          className={clsx(styles.carouselImage)}
          onClick={() => onImageClick(1)}
        />
      </div>

      <div className={clsx(styles.desktopLayoutColumn, styles.imageSmallSize)}>
        <Image
          src={getImageUrl(images[3])}
          alt={`Slide ${4}`}
          width={600}
          height={600}
          loading="lazy"
          className={clsx(styles.carouselImage, styles.lastTopImage)}
          onClick={() => onImageClick(1)}
        />
        <Image
          src={getImageUrl(images[4])}
          alt={`Slide ${5}`}
          width={600}
          height={600}
          loading="lazy"
          className={clsx(styles.carouselImage, styles.lastBottomImage)}
          onClick={() => onImageClick(1)}
        />
      </div>
    </div>
  );
};
