'use client';

import { PostType, PostsResponse } from '../types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PostTile } from '../../../../components/PostTile';
import styles from './index.module.scss';
import useSWR from 'swr';
import APIClient from '@/utils/apiClient';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { breakpoints } from '@/utils/breakpoint';
import clsx from 'clsx';
import { useWindowWidth } from '@/utils/hooks/useWindowWidth';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { MasonryContainer } from './Masonry';

const limit = 20; // each time fetch posts number

const getPosts = async (
  nextToken: string,
  category: string
): Promise<PostsResponse> => {
  try {
    const client = new APIClient();
    return await client.post('/posts', {
      limit,
      next_token: nextToken,
      category,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { results: [], next_token: '' };
  }
};

export interface PostListProps {
  category: string;
  initialPosts: PostType[];
  nextToken: string;
}

export const PostList: React.FC<PostListProps> = ({
  initialPosts,
  nextToken: initialNextToken,
  category,
}: PostListProps) => {
  const windowWidth = useWindowWidth();
  const [nextToken, setNextToken] = useState<string>(initialNextToken);
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const param = useSearchParams();
  const router = useRouter();
  const loadingRef = useRef<HTMLDivElement>(null);

  // if the articles is not found, leave a message
  useEffect(() => {
    if (param.get('notfound') !== null) {
      toast.error('😑没找到对应帖子...', { position: 'top-center' });
      const url = new URL(window.location.href);
      url.search = url.search.replace('notfound', '');
      router.push(url.toString());
    }
  }, [param, router]);

  const [loadMoreData, setLoadMoreData] = useState(false);

  const [containTopNav, setContainTopNav] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    loadMoreData ? `api/posts?nextToken=${nextToken}` : null,
    () => getPosts(nextToken, category),
    {
      revalidateOnFocus: false,
    }
  );

  const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const appendDataToPosts = useCallback((newData: PostType[]) => {
    setPosts((prevPosts) => {
      const set = new Set([...prevPosts, ...newData]);
      return Array.from(set);
    });
  }, []);

  useEffect(() => {
    setContainTopNav(windowWidth < breakpoints.md);
  }, [windowWidth]);

  useEffect(() => {
    if (!isLoading && data?.results) {
      appendDataToPosts(data?.results);
      setNextToken(data?.next_token);
    }
  }, [isLoading, data, appendDataToPosts]);

  useEffect(() => {
    if (imagesLoadedCount === data?.results.length) {
      setImagesLoadedCount(0);
    }
  }, [imagesLoadedCount, data?.results.length]);

  useEffect(() => {
    const elementToObserve = loadingRef.current;
    if (!elementToObserve) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadMoreData((pre) => true);
          }
        });
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(elementToObserve);

    return () => {
      observer.unobserve(elementToObserve);
    };
  }, [loadingRef]);

  useEffect(() => {
    if (!loadMoreData || nextToken === '' || isLoading) return;
    setLoadMoreData(false);
    mutate();
  }, [loadMoreData, mutate, nextToken, isLoading]);

  return (
    <>
      <div
        className={clsx(
          styles.scrollArea,
          containTopNav && styles.scrollArea_containTopNav
        )}
        ref={ref}
      >
        <MasonryContainer>
          {posts.map((post, idx) => {
            return (
              <PostTile
                key={`post-tile-${idx}`}
                subject={post.subject}
                images={post.images}
                postId={post.postId}
                lazyloadImage={idx > 10}
                priority={idx < 5}
              />
            );
          })}
        </MasonryContainer>

        <div className={styles.loadingContainer}>
          <div
            ref={loadingRef}
            style={{
              position: 'absolute',
              height: '800px',
              zIndex: -1,
              width: 'calc(100% - 32px)',
              top: '-600px',
            }}
          >
            <div className={styles.innerLoading}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden flex justify-center">
                  Loading...
                </span>
              </Spinner>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
