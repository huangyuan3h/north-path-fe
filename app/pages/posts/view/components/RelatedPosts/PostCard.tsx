import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PostCard.module.scss';
import { PostType } from '../../../types';

interface PostCardProps {
  post: PostType;
}

function removeHTMLTags(htmlString: string): string {
  const regex = /<[^>]+>/g; // Regular expression to match HTML tags
  return htmlString.replace(regex, ''); // Replace tags with empty string
}

const contentLength = 120;

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const content = removeHTMLTags(post.content);
  return (
    <Link href={`/post/${post.postId}`} className={styles.postLink}>
      <Card className={styles.postCard}>
        <Row>
          <Col md={4} className={styles.imageContainer}>
            {
              <Image
                src={post.images[0]}
                alt={post.subject}
                width={140}
                height={140}
                className={styles.image}
              />
            }
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title>{post.subject}</Card.Title>
              <Card.Text className={styles.postContent}>
                {content.length > contentLength
                  ? `${content.substring(0, contentLength)}...`
                  : content}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Link>
  );
};

export default PostCard;
